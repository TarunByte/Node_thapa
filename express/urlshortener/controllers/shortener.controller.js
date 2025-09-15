import crypto from "crypto";
import {
  loadLinks,
  getLinkByShortCode,
  insertShortLink,
} from "../models/shortener.model.js";

// import { urls } from "../schema/url_schema.js";

export const getShortnerPage = async (req, res) => {
  try {
    // const file = await readFile(path.join("views", "index.html"));

    const links = await loadLinks();

    // const links = await urls.find();

    return res.render("index", { links, host: req.host });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const postShortenLink = async (req, res) => {
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    // const links = await loadLinks();
    const link = await getLinkByShortCode(shortCode);
    // const links = await urls.find();

    if (link) {
      return res
        .status(400)
        .send(
          '<h1>Url with that shortcode already exists, please choose another <a href="/">Go Back</a></h>'
        );
    }

    // links[finalShortCode] = url;
    // await saveLinks(links);
    // await saveLinks({ url, shortCode });
    // await urls.create({ url, shortCode });
    await insertShortLink({ url, shortCode: finalShortCode });

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

export const redirectToShortLink = async (req, res) => {
  try {
    const { shortCode } = req.params;
    // const links = await loadLinks();
    const link = await getLinkByShortCode(shortCode);
    // const link = await urls.findOne({ shortCode: shortCode });

    console.log(link);

    // if (!links[shortCode]) return res.status(404).send("404 error occurred");
    if (!link) return res.redirect("/404");

    return res.redirect(link.url);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};
