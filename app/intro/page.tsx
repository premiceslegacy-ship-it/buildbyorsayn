import { readFileSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { ReaderProse } from "@/components/reader/ReaderProse";
import { Ui4Shell } from "@/components/ui4/Ui4Shell";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import styles from "./intro.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Avant de commencer | BUILD", robots: { index: false, follow: false } };

function readIntroMarkdown(): string {
  return readFileSync(path.join(process.cwd(), "app", "intro", "content.md"), "utf8");
}

export default async function IntroPage() {
  const identity = await requirePageAccess("full", "/intro");
  const markdown = readIntroMarkdown();
  const body = markdown.split("\n## La suite", 1)[0];

  return <Ui4Shell identity={identity}>
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Avant de commencer</h1>
      </header>

      <article className={styles.prose}>
        <ReaderProse section={{ content: body }} />
      </article>

      <section className={styles.action} aria-labelledby="intro-action">
        <div className={styles.actionCopy}>
          <h2 id="intro-action">Ton créneau est fixé.</h2>
          <p>Ouvre le programme et construis le premier objet.</p>
        </div>
        <Link className="btn btn--p" href="/programme">Voir le programme</Link>
      </section>
    </main>
  </Ui4Shell>;
}
