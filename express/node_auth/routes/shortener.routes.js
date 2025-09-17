import { Router } from "express";
import {
  postShortenLink,
  getShortnerPage,
  redirectToShortLink,
} from "../controllers/shortener.controller.js";

const router = Router();

router.get("/", getShortnerPage);
router.post("/", postShortenLink);
router.get("/:shortCode", redirectToShortLink);

//default export
// export default router;

// Named export
export const shortenerRoutes = router;
