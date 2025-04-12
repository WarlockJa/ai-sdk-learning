import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";
import ChatForm from "./_components/ChatForm";

export const runtime = "edge";

export default function TextGeneration() {
  return (
    <main className="prose dark:prose-invert m-auto min-h-screen w-screen max-w-5xl p-12 outline outline-red-500">
      <ViewTransition name="navcard-title-/text">
        <h1>AI Text Generation</h1>
      </ViewTransition>
      <Link href={"/"}>Return Home</Link>

      <ChatForm />
    </main>
  );
}
