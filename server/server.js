import { Inngest } from "inngest";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const adapter = new PrismaNeon(sql);

const prisma = new PrismaClient({
  adapter,
});

export const inngest = new Inngest({
  id: "project-manager",
});

/* USER CREATE */

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;

    try {
      await prisma.user.create({
        data: {
          id: data.id,
          email: data.email_addresses[0]?.email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
        },
      });
    } catch (error) {
      console.error("User create error:", error);
    }
  }
);

/* USER UPDATE */

const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk", event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;

    try {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data.email_addresses[0]?.email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
        },
      });
    } catch (error) {
      console.error("User update error:", error);
    }
  }
);

/* USER DELETE */

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk", event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await prisma.user.delete({
        where: { id: event.data.id },
      });
    } catch (error) {
      console.error("User delete error:", error);
    }
  }
);

/* EXPORT */

export const functions = [
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
];