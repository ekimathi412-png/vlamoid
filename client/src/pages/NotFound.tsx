import { ArrowUpRight, Shell } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found — Vlamoid";
  }, []);
  return (
    <main className="not-found-page">
      <Shell size={45} strokeWidth={1} />
      <span className="eyebrow">404 / A WRONG TURN</span>
      <h1>
        Let’s get you
        <br />
        <em>back to the table.</em>
      </h1>
      <p>That page isn’t here. A good evening still awaits.</p>
      <a href="/" className="button button-brass">
        Back to Vlamoid <ArrowUpRight size={18} />
      </a>
    </main>
  );
}
