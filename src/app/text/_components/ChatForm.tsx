"use client";

import { useState } from "react";
import { Message, continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function ChatForm() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  return (
    <div className="h-[78vh] overflow-y-scroll">
      <div>
        {conversation.map((message, index) => (
          <div key={index}>
            {message.role}: {message.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setInput("");
        }}
        className="fixed inset-x-0 bottom-0 mx-auto flex w-screen max-w-4xl gap-2 p-4"
      >
        <input
          type="text"
          placeholder="Ask anything"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
          className="flex-1 rounded-2xl border px-4 py-2"
          max={255}
        />
        <button
          className="rounded-2xl border p-2"
          onClick={async () => {
            const { messages, newMessage } = await continueConversation([
              ...conversation,
              { role: "user", content: input },
            ]);

            let textContent = "";

            for await (const delta of readStreamableValue(newMessage)) {
              textContent = `${textContent}${delta}`;

              setConversation([
                ...messages,
                { role: "assistant", content: textContent },
              ]);
            }
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
