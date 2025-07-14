"use server";

import prisma from "@/prisma/client";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const updateName = async (newName: string) => {
  const session = await getServerSession(authOptions);

  await prisma.user.update({
    where: { email: session?.user?.email || "" },
    data: { name: newName },
  });

  revalidatePath(`/`, "layout");
  return { message: "Name updated successfully !!" };
};
