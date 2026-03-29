import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CellSkinsGallery } from "./components/cell-skins-gallery";

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
      <CellSkinsGallery />
    </main>
  );
}
