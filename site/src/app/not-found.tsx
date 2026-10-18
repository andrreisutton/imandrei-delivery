import { Link } from "next-view-transitions";
import { Waveform } from "@/components/waveform";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <Waveform seed="404" bars={40} className="mx-auto h-8 w-56 text-faint" />
      <h1 className="h-title text-6xl sm:text-8xl mt-8">
        That page doesn&apos;t exist.
      </h1>
      <p className="mt-4 text-lg text-muted">
        The link might be old, or the page moved. Everything worth hearing is one click away.
      </p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
