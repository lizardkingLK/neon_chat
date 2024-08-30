import { ImageResponse } from "next/og";
import { metadata } from "./layout";

export const runtime = "edge";

export const alt = `${metadata.title} - ${metadata.description}`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div className="flex flex-col items-center justify-center w-full h-full text-8xl bg-gradient-to-b from-black to-zinc-700">
        <div className="font-bold text-green-500">N_CHAT</div>
        <div className="mt-5 text-5xl text-white">{alt}</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
