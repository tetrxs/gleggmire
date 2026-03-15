"use client";

import { useState, useEffect } from "react";

export function TimeEvents() {
  const [show420, setShow420] = useState(false);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    function checkTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // 4:20 check (AM or PM)
      setShow420((hours === 4 || hours === 16) && minutes >= 20 && minutes < 25);

      // Night mode: 00:00 - 06:00
      setIsNight(hours >= 0 && hours < 6);
    }

    checkTime();
    const interval = setInterval(checkTime, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 4:20 Banner */}
      {show420 && (
        <div
          className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 md:bottom-4"
          style={{ animation: "time-420-pulse 1.5s ease-in-out infinite" }}
        >
          <div
            className="xp-raised flex items-center gap-2 px-4 py-2 text-[13px] font-bold whitespace-nowrap"
            style={{
              backgroundColor: "var(--xp-gruen)",
              color: "#FFFFFF",
              fontFamily: "Tahoma, Verdana, sans-serif",
            }}
          >
            <span className="text-[18px]">&#x1F33F;</span>
            <span>
              Es ist 4:20 &mdash; Zeit f&uuml;r einen Lungen-Torpedo
            </span>
            <span className="text-[18px]">&#x1F33F;</span>
          </div>
          <style>{`
            @keyframes time-420-pulse {
              0%, 100% { transform: translateX(-50%) scale(1); }
              50% { transform: translateX(-50%) scale(1.05); }
            }
          `}</style>
        </div>
      )}

      {/* Night mode overlay */}
      {isNight && (
        <>
          <div
            className="pointer-events-none fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0, 0, 20, 0.15)" }}
          />
          <div
            className="fixed bottom-2 right-2 z-50 text-[20px]"
            title="Es ist Nacht... geh schlafen, Sar"
            style={{ animation: "night-owl-float 3s ease-in-out infinite" }}
          >
            &#x1F989;
          </div>
          <style>{`
            @keyframes night-owl-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
          `}</style>
        </>
      )}
    </>
  );
}
