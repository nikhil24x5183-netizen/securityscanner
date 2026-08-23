"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamUrl = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false, // Required for sandbox stability
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log("Autoplay prevented:", err));
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => console.log("Autoplay prevented:", err));
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* 60% Opacity Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Overlays: Dark Left-to-Right & Bottom-Up Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-[#070b0a]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-transparent to-[#070b0a]/40" />

      {/* Grid System: 3 Thin Vertical Lines at 25%, 50%, 75% */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-white/10" />
        <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/10" />
        <div className="absolute left-[75%] top-0 bottom-0 w-[1px] bg-white/10" />
      </div>

      {/* Central Glow: SVG Ellipse Glow with 25px Gaussian Blur Filter */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-70">
        <svg className="w-full h-full" viewBox="0 0 700 300">
          <defs>
            <filter id="glow-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="25" />
            </filter>
            <radialGradient id="cyan-green-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5ed29c" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#070b0a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse
            cx="350"
            cy="150"
            rx="300"
            ry="100"
            fill="url(#cyan-green-glow)"
            filter="url(#glow-blur)"
          />
        </svg>
      </div>
    </div>
  );
};
