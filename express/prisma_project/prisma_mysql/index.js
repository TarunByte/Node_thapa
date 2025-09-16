import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  //? Create (Insert Data)
  //? Single User
  //   const user = await prisma.user.create({
  //     data: {
  //       name: "vinod",
  //       email: "thapa@test.com",
  //     },
  //   });
  //   console.log(user);
  //? Multiple User
  //   const newUsers = await prisma.user.createMany({
  //     data: [
  //       { name: "Alice", email: "alice@example.com" },
  //       { name: "Bob", email: "bob@example.com" },
  //     ],
  //   });
  //   console.log(newUsers);
  //? Read (Fetch Data)
  //? Get All Users
  //   const users = await prisma.user.findMany();
  //   console.log(users);
  //? Get a Single User by ID
  //   const user = await prisma.user.findUnique({
  //     where: { id: 2 },
  //   });
  //   console.log(user);
  //? Get Users with Filtering
  //   const user = await prisma.user.findMany({
  //     where: { name: "vinod" },
  //   });
  //   console.log(user);
  //? Update (Modify Data)
  //? Update One User
  //   const updatedUser = await prisma.user.update({
  //     where: { id: 3 },
  //     data: { name: "Bob" },
  //   });
  //   console.log(updatedUser);
  //? Update Multiple Users
  //   const updatedUser = await prisma.user.updateMany({
  //     where: { name: "Bob" },
  //     data: { email: "bob@thapa.com" },
  //   });
  //   console.log(updatedUser);
  //? Delete (Remove Data)
  //? Delete One User
  //   const deletedUser = await prisma.user.delete({
  //     where: { id: 3 },
  //   });
  //   console.log(deletedUser);
  //? Delete Multiple Users
  //   const deletedUsers = await prisma.user.deleteMany({
  //     where: [{ id: 3 }, { id: 4 }, { id: 5 }],
  //   });
  //   console.log(deletedUsers);
};

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

//? prisma generate -> Updates the Prisma Client code so you can use the latest schema in your application.
