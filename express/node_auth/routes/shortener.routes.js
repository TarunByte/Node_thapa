import { Router } from "express";
import {
  postShortenLink,
  getShortnerPage,
  redirectToShortLink,
  getShortenerEditPage,
  postShortenerEditPage,
  deleteShortCode,
} from "../controllers/shortener.controller.js";

const router = Router();

router.get("/", getShortnerPage);

router.post("/", postShortenLink);

router.get("/:shortCode", redirectToShortLink);

router.route("/edit/:id").get(getShortenerEditPage).post(postShortenerEditPage);

router.route("/delete/:id").post(deleteShortCode);

//default export
// export default router;

// Named export
export const shortenerRoutes = router;
