import { Router } from "express";
import {
  postShortenLink,
  getShortnerPage,
  redirectToShortLink,
  getShortenerEditPage,
} from "../controllers/shortener.controller.js";

const router = Router();

router.get("/", getShortnerPage);

router.post("/", postShortenLink);

router.get("/:shortCode", redirectToShortLink);

router.route("/edit/:id").get(getShortenerEditPage);

//default export
// export default router;

// Named export
export const shortenerRoutes = router;
