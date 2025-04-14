import { unstable_ViewTransition as ViewTransition } from "react";
import Link from "next/link";
import ImageGenerationForm from "./_components/ImageGenerationForm";

export const runtime = "edge";

export default function ImageGeneration() {
  return (
    <main className="prose dark:prose-invert m-auto min-h-screen w-screen max-w-5xl p-12">
      <ViewTransition name="navcard-title-/image">
        <h1>AI Image Generation</h1>
      </ViewTransition>
      <Link href={"/"}>Return Home</Link>

      <ImageGenerationForm />
    </main>
  );
}
