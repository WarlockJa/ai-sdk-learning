import { streamText, UIMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const workerAI_textGeneration = createOpenAICompatible({
  name: "workerAI_textGeneration",
  baseURL: `http://text-generation-worker.warlockja.workers.dev`,
  headers: {
    "x-access-key": process.env.ACCESS_KEY as string,
  },
});

const model = workerAI_textGeneration("");

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // const text = await generateText({
  //   model,
  //   messages,
  // });
  // console.log(text);
  // return new Response(JSON.stringify(text), { status: 200 });

  const result = streamText({
    model,
    messages,
  });

  // console.log("TEST: ", await result.text);

  return result.toDataStreamResponse();
}
