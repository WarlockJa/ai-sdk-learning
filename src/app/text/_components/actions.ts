"use server";

import { createStreamableValue } from "ai/rsc";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function continueConversation(history: Message[]) {
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
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream finished.");
        stream.done();
        break;
      }

      const chunk = decoder.decode(value);

      try {
        const data = JSON.parse(chunk.slice(6)).response;
        console.log("DATA: ", data);
        stream.update(data);
      } catch (error) {
        console.log("ERR CHUNK: ", chunk.slice(6), error);
      }
    }
  })();

  return {
    messages: history,
    newMessage: stream.value,
  };
}
