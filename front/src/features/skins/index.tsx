import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
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
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Cell Skins</h1>
        <p className="text-muted-foreground">
          Private page for previewing all available cell skin variants.
        </p>
      </div>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Published Skins</h2>
        <CellSkinsGallery />
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Non Published Skins</h2>
        <p className="text-muted-foreground">
          Work-in-progress skins to preview before publishing.
        </p>
        <NonPublishedCellSkinsGallery />
      </section>
    </main>
  );
}
