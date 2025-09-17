import { eq } from "drizzle-orm";
import { db } from "./config/db.js";
import { usersTable } from "./drizzle/schema.js";

const main = async () => {
  //? Insert
  //   const insertUser = await db.insert(usersTable).values({
  //     name: "vinod",
  //     age: "22",
  //     email: "test@thapa.com",
  //   });
  //   const insertUser = await db.insert(usersTable).values([
  //     { name: "vinod", age: "22", email: "test1@thapa.com" },
  //     { name: "bahadur", age: "22", email: "test2@thapa.com" },
  //     { name: "thapa", age: "22", email: "test3@thapa.com" },
  //   ]);
  //   console.log(insertUser);
  //? Read
  //   const users = await db.select().from(usersTable);
  //   const users = await db.select().from(usersTable).where({
  //     email: "test2@thapa.com",
  //   });
  //   console.log(users);
  //? Update Query
  //   const updatedUser = await db
  //     .update(usersTable)
  //     .set({ name: "bahadur thapa" })
  //     .where({ email: "test2@thapa.com" });
  //   const updatedUser = await db
  //     .update(usersTable)
  //     .set({ name: "bahadur" })
  //     .where(eq(usersTable.email, "test2@thapa.com"));
  //   console.log(updatedUser);
  //? Delete Query
  //   await db.delete(usersTable).where({ email: "test2@thapa.com" });
  await db.delete(usersTable).where(eq(usersTable.email, "test3@thapa.com"));
};

main().catch((error) => {
  console.log(error);
});
