import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
    console.log(">>> Started Music Generation Request");

    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
    });

    try {
        const body = await req.json().catch(() => ({}));
        const { prompt, userId, lyrics, duration, batch_size } = body;

        if (!prompt || !userId) {
            return NextResponse.json({ error: "Missing prompt or userId" }, { status: 400 });
        }

        const replicateToken = process.env.REPLICATE_API_TOKEN;
        if (!replicateToken) {
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const replicate = new Replicate({ auth: replicateToken });

        // 1. Preparation
        const inputData = {
            caption: prompt,
            lyrics: lyrics || "[inst]",
            duration: duration || 30,
            batch_size: batch_size || 1,
            timeout_seconds: 300,
        };

        console.log(">>> Calling Replicate with:", inputData);

        // 2. Call Replicate (it returns an array of URIs)
        const output = (await replicate.run(
            "visoar/ace-step-1.5:fd851baef553cb1656f4a05e8f2f8641672f10bc808718f5718b4b4bb2b07794",
            { input: inputData }
        )) as string[];

        if (!output || !Array.isArray(output) || output.length === 0) {
            throw new Error("AI Model failed to generate audio output");
        }

        console.log(`>>> Model generated ${output.length} tracks`);

        // 3. Process each track and save to DB
        const results = [];
        for (let i = 0; i < output.length; i++) {
            const audioUrl = output[i];

            // 3.1 Create Record
            const { data: musicRecord, error: insertError } = await supabase
                .from("musics")
                .insert({
                    user_id: userId,
                    prompt: prompt,
                    status: "pending",
                    title: `${prompt.substring(0, 25)}${output.length > 1 ? ` (v${i + 1})` : ''}`,
                })
                .select()
                .single();

            if (insertError) {
                console.error(">>> DB Insert Error:", insertError);
                continue;
            }

            // 3.2 Fetch and Upload
            try {
                const fetchRes = await fetch(audioUrl);
                const blob = await fetchRes.blob();
                const fileName = `${userId}/${musicRecord.id}.mp3`;

                await supabase.storage
                    .from("musics")
                    .upload(fileName, blob, { contentType: "audio/mpeg", upsert: true });

                const { data: urlData } = supabase.storage.from("musics").getPublicUrl(fileName);

                await supabase
                    .from("musics")
                    .update({ status: "completed", file_url: urlData.publicUrl })
                    .eq("id", musicRecord.id);

                results.push({ id: musicRecord.id, url: urlData.publicUrl });
            } catch (err) {
                console.error(`>>> Failed to process track ${i}:`, err);
                await supabase.from("musics").update({ status: "failed" }).eq("id", musicRecord.id);
            }
        }

        return NextResponse.json({
            success: true,
            count: results.length,
            results
        });

    } catch (error: any) {
        console.error(">>> API Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
