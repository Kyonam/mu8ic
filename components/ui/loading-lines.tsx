"use client";

import React from "react";

const LoadingLines: React.FC = () => {
  const letters = "Loading".split("");

  return (
    <div className="relative flex items-center justify-center min-h-[100px] w-auto font-poppins text-[1.4rem] font-semibold select-none text-white overflow-visible">
      {/* Styles for keyframes (plain style tag instead of styled-jsx for App Router compatibility) */}
      <style dangerouslySetInnerHTML={{
        __html: `
                @keyframes transformAnim {
                    0% { transform: translate(-50%); }
                    100% { transform: translate(50%); }
                }

                @keyframes opacityAnim {
                    0%, 100% { opacity: 0; }
                    15% { opacity: 1; }
                    65% { opacity: 0; }
                }

                @keyframes letterAnim {
                    0% { opacity: 0; }
                    5% {
                        opacity: 1;
                        text-shadow: 0 0 4px #fff;
                        transform: scale(1.1) translateY(-2px);
                    }
                    20% { opacity: 0.2; }
                    100% { opacity: 0; }
                }
            ` }} />

      {/* Animated letters */}
      <div className="flex gap-[0.1em] z-[2]">
        {letters.map((letter, idx) => (
          <span
            key={idx}
            className="relative inline-block opacity-0"
            style={{
              animation: `letterAnim 4s linear infinite`,
              animationDelay: `${0.1 + idx * 0.105}s`
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Loader background */}
      <div className="absolute top-0 left-0 w-full h-full z-[1] bg-transparent [mask:repeating-linear-gradient(90deg,transparent_0,transparent_6px,black_7px,black_8px)] pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle_at_50%_50%,#ff0_0%,transparent_50%),
                                        radial-gradient(circle_at_45%_45%,#f00_0%,transparent_45%),
                                        radial-gradient(circle_at_55%_55%,#0ff_0%,transparent_45%),
                                        radial-gradient(circle_at_45%_55%,#0f0_0%,transparent_45%),
                                        radial-gradient(circle_at_55%_45%,#00f_0%,transparent_45%)`,
            mask: `radial-gradient(circle_at_50%_50%,transparent_0%,transparent_10%,black_25%)`,
            WebkitMask: `radial-gradient(circle_at_50%_50%,transparent_0%,transparent_10%,black_25%)`,
            animation: `transformAnim 2s infinite alternate cubic-bezier(0.6,0.8,0.5,1), opacityAnim 4s infinite`
          }}
        />
      </div>
    </div>
  );
};

export default LoadingLines;
