import crypto from "crypto";
import {
  insertShortLink,
  getAllShortLinks,
  getShortLinkByShortCode,
} from "../services/shorterner.services.js";

export const getShortnerPage = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const links = await getAllShortLinks(req.user.id);

    return res.render("index", { links, host: req.host });
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
      return res
        .status(400)
        .send(
          '<h1>Url with that shortcode already exists, please choose another <a href="/">Go Back</a></h>'
        );
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
