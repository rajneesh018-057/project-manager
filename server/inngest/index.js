import { Inngest } from "inngest";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });
// 2. Initialize Inngest
export const inngest = new Inngest({ id: "project-manager" });

// 3. CREATE USER
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0]?.email_address,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url,
      },
    });
  }
);

// 4. UPDATE USER
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk", event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses[0]?.email_address,
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url,
      },
    });
  }
);

// 5. DELETE USER
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk", event: "clerk/user.deleted" },
  async ({ event }) => {
    await prisma.user.delete({
      where: { id: event.data.id },
    });
  }
);

// 6. EXPORT ARRAY
export const functions = [
  syncUserCreation,
  syncUserUpdate,
  syncUserDeletion,
];