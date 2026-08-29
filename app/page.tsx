import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-800">
        Before your consultation
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
        A few quick questions so your clinician is prepared.
      </h1>
      <p className="mt-4 text-lg text-stone-600">About 4 minutes. You can type, tap, or speak.</p>

      <Card className="mt-10">
        <p className="text-stone-700">
          This stays on your device until you submit. Use a made-up story if you’re just trying the
          demo.
        </p>
        <Link
          href="/intake"
          className="mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl bg-teal-800 px-6 text-lg font-medium text-white hover:bg-teal-900"
        >
          Start
        </Link>
      </Card>
    </main>
  );
}
