import "dotenv/config";
import { db } from "./db/index.js";
import { users, messages } from "./db/schema.js";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Starting database wipe and seed...");
  
  // 1. Delete messages (due to foreign key constraints)
  console.log("Deleting messages...");
  await db.delete(messages);
  
  // 2. Delete users
  console.log("Deleting users...");
  await db.delete(users);

  // 3. Insert new meaningful users
  console.log("Seeding new users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const newUsers = [
    {
      username: "Alice",
      password: hashedPassword,
      profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
    {
      username: "Bob",
      password: hashedPassword,
      profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
    {
      username: "Charlie",
      password: hashedPassword,
      profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    },
    {
      username: "Diana",
      password: hashedPassword,
      profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    }
  ];

  await db.insert(users).values(newUsers);

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
