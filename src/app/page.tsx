import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-white to-pink-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col space-y-8 text-center">
        <h1 className="text-6xl font-black tracking-tight">
          Confeitaria <span className="text-pink-500">Dev</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-xl">
          Seu projeto Next.js + Tailwind está pronto! Comece explorando nosso laboratório de componentes e layouts.
        </p>
        <div className="flex gap-4">
          <Link href="/learning">
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-lg px-8">
              Entrar no Laboratório
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
