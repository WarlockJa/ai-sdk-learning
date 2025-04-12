"use client";
import { useChat } from "@ai-sdk/react";

export default function ChatForm() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({});
  console.log("MSG: ", messages);
  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? "User: " : "AI: "}
          {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="prompt"
          value={input}
          onChange={handleInputChange}
        />
        <button>Submit</button>
      </form>
    </>
  );
}
