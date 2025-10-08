import crypto from "crypto";
import {
  insertShortLink,
  getAllShortLinks,
  getShortLinkByShortCode,
  findShortLinkById,
  updateShorCode,
  deleteShortCodeById,
} from "../services/shorterner.services.js";
import z from "zod";
import { shortenerSearchParamsSchema } from "../validators/shortener-validator.js";

export const getShortnerPage = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const searchParams = shortenerSearchParamsSchema.parse(req.query);

    // const links = await getAllShortLinks(req.user.id);
    const { shortLinks, totalCount } = await getAllShortLinks({
      userId: req.user.id,
      limit: 10,
      offset: (searchParams.page - 1) * 10,
    });

    console.log("shortLinks: ", shortLinks);

    // totalCount = 100
    const totalPages = Math.ceil(totalCount / 10);

    return res.render("index", {
      links: shortLinks,
      host: req.host,
      currentPage: searchParams.page,
      totalPages: totalPages,
      errors: req.flash("errors"),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const postShortenLink = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const link = await getShortLinkByShortCode(finalShortCode);

    if (link) {
      // return res
      //   .status(400)
      //   .send(
      //     '<h1>Url with that shortcode already exists, please choose another <a href="/">Go Back</a></h>'
      //   );
      req.flash(
        "errors",
        "URL with that shortcode already exists, please choose another"
      );
      return res.redirect("/");
    }

    await insertShortLink({
      url,
      shortCode: finalShortCode,
      userId: req.user.id,
    });

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const redirectToShortLink = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const link = await getShortLinkByShortCode(shortCode);

    if (!link) return res.redirect("/404");

    return res.redirect(link.url);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};
// getShortenerEditPage
export const getShortenerEditPage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  // const id = req.params;
  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
  if (error) return res.redirect("/404");

  try {
    const shortLink = await findShortLinkById(id);
    if (!shortLink) return res.redirect("/404");

    res.render("edit-shortLink", {
      id: shortLink.id,
      url: shortLink.url,
      shortCode: shortLink.shortCode,
      errors: req.flash("errors"),
    });
  } catch (err) {
    console.log(err);
    return res.redirect(500).send("Internal server error");
  }
};

// postShortenerEditPage
export const postShortenerEditPage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  // const id = req.params;
  const { data: id, error } = z.coerce.number().int().safeParse(req.params.id);
  if (error) return res.redirect("/404");

  try {
    const { url, shortCode } = req.body;

    const link = await getShortLinkByShortCode(shortCode);

    if (link) {
      req.flash(
        "errors",
        `"${shortCode}" shortcode already exists, please choose another`
      );
      return res.redirect(`/edit/${id}`);
    }

    const newUpdatedShortCode = await updateShorCode({ id, url, shortCode });
    if (!newUpdatedShortCode) return res.redirect("/404");

    res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.redirect(500).send("Internal server error");
  }
};

//deleteShortCode
export const deleteShortCode = async (req, res) => {
  try {
    const { data: id, error } = z.coerce
      .number()
      .int()
      .safeParse(req.params.id);
    if (error) return res.redirect("/404");

    await deleteShortCodeById(id);
    return res.redirect("/");
  } catch (error) {
    return res.redirect(500).send("Internal server error");
  }
};
