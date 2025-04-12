import NavCard from "@/components/common/NavCard";

export const runtime = "edge";

export default function Home() {
  return (
    <main className="prose dark:prose-invert m-auto min-h-screen w-screen max-w-5xl p-12 outline outline-red-500">
      <h1>AI SDK testing suite</h1>
      <ul>
        {ITEMS.map((item) => (
          <NavCard key={item.href} {...item}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. In
            asperiores laboriosam quam dolorem! Distinctio odit debitis
            aspernatur numquam aliquam, alias sed repudiandae fugit aliquid quas
            aut maiores. Mollitia, itaque tempore?
          </NavCard>
        ))}
      </ul>
    </main>
  );
}

const ITEMS: NavCard[] = [
  {
    title: "AI Text Generation",
    description:
      "Simple example of a component displaying streaming text generated by the AI from a prompt.",
    href: "/text",
  },
];
