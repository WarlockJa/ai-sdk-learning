"use server";

import { createStreamableValue } from "ai/rsc";

export async function imageGenerationAction(prompt: string) {
  const body = new FormData();
  body.append("prompt", prompt);
  // if (image) body.append("image", image);
  // if (mask) body.append("mask", mask);
  // if (width) body.append("width", width.toString());
  // if (height) body.append("height", height.toString());

  const response = await fetch(process.env.IMAGE_GENERATE_WORKER_URL!, {
    method: "POST",
    headers: {
      "x-access-key": process.env.IGW_ACCESS_KEY!,
    },
    body,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`,
    );
  }

  if (!response.body) {
    throw new Error("Response body is empty.");
  }

  const stream = createStreamableValue();
  const reader = response.body.getReader();

  // creating async IIFE to populate stream response
  (async () => {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream finished.");
        stream.done();
        break;
      }

      stream.update(value);
    }
  })();

  return stream.value;
}
