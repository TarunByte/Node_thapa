// import { PrismaClient } from "@prisma/client";
import { eq } from "drizzle-orm";
import { db } from "../config/db-client.js";
import { shortLinksTable } from "../drizzle/schema.js";

// const prisma = new PrismaClient();

export const getAllShortLinks = async () => {
  //   const [rows] = await db.execute("select * from short_links");
  //   return rows;

  // const allShortLinks = await prisma.shortLink.findMany();
  // return allShortLinks;

  return await db.select().from(shortLinksTable);
};

export const getShortLinkByShortCode = async (shortCode) => {
  // return await shortenerCollection.findOne({ shortCode: shortcode });
  //   const [rows] = await db.execute(
  //     `select * from short_links where short_code = ?`,
  //     [shortcode]
  //   );

  // const shortLink = await prisma.shortLink.findUnique({
  //   where: { shortCode: shortcode },
  // });
  // return shortLink;

  const [result] = await db
    .select()
    .from(shortLinksTable)
    .where(eq(shortLinksTable.shortCode, shortCode));
  return result;
};

export const insertShortLink = async ({ url, shortCode }) => {
  // return shortenerCollection.insertOne(link);
  //   const [result] = await db.execute(
  //     "insert into short_links(short_code, url) values(?,?)",
  //     [shortCode, url]
  //   );
  //   return result;

  // const newShortLink = prisma.shortLink.create({
  //   data: { shortCode, url },
  // });
  // return newShortLink;

  await db.insert(shortLinksTable).values({ url, shortCode });
};
