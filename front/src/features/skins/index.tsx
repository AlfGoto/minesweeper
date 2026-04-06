import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NonPublishedBackgroundSkins } from "./backgrounds/skins";
import { BackgroundSkinsGallery } from "./components/background-skins-gallery";
import { CellSkinsGallery } from "./components/cell-skins-gallery";
import { NonPublishedCellSkinsGallery } from "./components/non-published-cell-skins-gallery";
export { SkinsPage } from "./skins-page";

const AUTHORIZED_EMAIL = "alfgoto@gmail.com";

export async function PreviewSkinsPage() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail || userEmail !== AUTHORIZED_EMAIL) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-8 space-y-6">
      <section className="space-y-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Preview Skins</h1>
          <p className="text-muted-foreground">
            Private page for previewing available cell and background skin
            variants.
          </p>
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Background Skins</h2>
        <p className="text-muted-foreground">
          Click a square swatch to open a larger background preview.
        </p>
        <BackgroundSkinsGallery />
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Non Published Background Skins</h2>
        <p className="text-muted-foreground">
          Experimental background skins staged here before publishing.
        </p>
        <BackgroundSkinsGallery
          skinsMap={NonPublishedBackgroundSkins}
          emptyMessage="No non published background skins yet."
        />
      </section>
      <div className="space-y-1">
        <h2 className="text-3xl font-bold">Cell Skins</h2>
        <p className="text-muted-foreground">
          Private page for previewing all available cell skin variants.
        </p>
      </div>
      <section className="space-y-3">
        <h3 className="text-2xl font-semibold">Published Skins</h3>
        <CellSkinsGallery />
      </section>
      <section className="space-y-3">
        <h3 className="text-2xl font-semibold">Non Published Skins</h3>
        <p className="text-muted-foreground">
          Work-in-progress skins to preview before publishing.
        </p>
        <NonPublishedCellSkinsGallery />
      </section>
    </main>
  );
}
