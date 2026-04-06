"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import type { CellSkin, BackgroundSkin } from "@/types/bff";
import {
  buyCellSkin,
  selectCellSkin,
  buyBackgroundSkin,
  selectBackgroundSkin,
} from "@/types/bff/uncached-functions";

type SkinActionResult = {
  ok: boolean;
  message: string;
};

export async function buyCellSkinAction(skin: CellSkin): Promise<SkinActionResult> {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return {
      ok: false,
      message: "Please login first.",
    };
  }

  const response = await buyCellSkin(userEmail, skin);

  if (response.error) {
    console.error(response.error);
    return {
      ok: false,
      message:
        response.error.message ?? "Could not buy this skin right now. Try again.",
    };
  }

  revalidatePath("/skins");
  revalidatePath("/");

  return {
    ok: true,
    message: response.data?.message ?? "Skin bought.",
  };
}

export async function selectCellSkinAction(
  skin: CellSkin,
): Promise<SkinActionResult> {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return {
      ok: false,
      message: "Please login first.",
    };
  }

  const response = await selectCellSkin(userEmail, skin);

  if (response.error) {
    console.error(response.error);
    return {
      ok: false,
      message:
        response.error.message ??
        "Could not select this skin right now. Try again.",
    };
  }

  revalidatePath("/skins");
  revalidatePath("/");

  return {
    ok: true,
    message: response.data?.message ?? "Skin selected.",
  };
}

export async function buyBackgroundSkinAction(
  skin: BackgroundSkin,
): Promise<SkinActionResult> {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return {
      ok: false,
      message: "Please login first.",
    };
  }

  const response = await buyBackgroundSkin(userEmail, skin);

  if (response.error) {
    console.error(response.error);
    return {
      ok: false,
      message:
        response.error.message ?? "Could not buy this skin right now. Try again.",
    };
  }

  revalidatePath("/skins");
  revalidatePath("/");

  return {
    ok: true,
    message: response.data?.message ?? "Background skin bought.",
  };
}

export async function selectBackgroundSkinAction(
  skin: BackgroundSkin,
): Promise<SkinActionResult> {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return {
      ok: false,
      message: "Please login first.",
    };
  }

  const response = await selectBackgroundSkin(userEmail, skin);

  if (response.error) {
    console.error(response.error);
    return {
      ok: false,
      message:
        response.error.message ??
        "Could not select this skin right now. Try again.",
    };
  }

  revalidatePath("/skins");
  revalidatePath("/");

  return {
    ok: true,
    message: response.data?.message ?? "Background skin selected.",
  };
}
