"use server";

import { createStreamableValue } from "ai/rsc";

export async function imageGenerationAction(prompt: string) {
  "use server";

  const response = await fetch(
    "https://text-generation-worker.warlockja.workers.dev",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-key": process.env.ACCESS_KEY as string,
      },
      body: JSON.stringify({ messages: history }),
    },
  );

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
  const decoder = new TextDecoder();

  // creating async IIFE to populate stream response
  (async () => {
    let chunk = "";
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream finished.");
        stream.done();
        break;
      }

      chunk += decoder.decode(value);
      try {
        const data = JSON.parse(chunk.slice(6)).response;
        chunk = "";
        stream.update(data);
      } catch {}
    }
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
