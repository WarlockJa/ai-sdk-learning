"use client";

import { useState } from "react";
import { imageGenerationAction } from "./actions";
import { cn } from "@/lib/utils";
import { readStreamableValue } from "ai/rsc";
import { Loader2 } from "lucide-react";

export default function ImageGenerationForm() {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string>();

  return (
    <div>
      <div className="relative min-h-12 w-full">
        {isLoading && (
          <Loader2 className="absolute inset-0 m-auto animate-spin" size={40} />
        )}
        {resultImage && (
          <img
            src={resultImage}
            alt="Generated Image"
            className={cn(
              "object-contain",
              isLoading && "animate-pulse opacity-50",
            )}
          />
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPrompt("");
          setIsLoading(true);
        }}
        className="fixed inset-x-0 bottom-0 mx-auto flex w-screen max-w-4xl gap-2 p-4"
      >
        <input
          type="text"
          placeholder="Image prompt"
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
          }}
          className="flex-1 rounded-2xl border px-4 py-2"
          min={15}
          max={255}
        />
        <button
          className="rounded-2xl border p-2"
          disabled={isLoading}
          onClick={async () => {
            const streamedValue = await imageGenerationAction(prompt);

            const chunks = [];
            for await (const delta of readStreamableValue(streamedValue)) {
              chunks.push(delta);
            }

            // Combine the chunks into a single Uint8Array
            const concatenatedChunks = new Uint8Array(
              chunks.reduce((acc, chunk) => acc + chunk.length, 0),
            );

            let offset = 0;
            for (const chunk of chunks) {
              concatenatedChunks.set(chunk, offset);
              offset += chunk.length;
            }

            // Convert the Uint8Array to a base64-encoded string
            const base64Image =
              Buffer.from(concatenatedChunks).toString("base64");
            setResultImage(`data:image/png;base64,${base64Image}`);
            setIsLoading(false);
          }}
        >
          Generate Image
        </button>
      </form>
    </div>
  );
}
