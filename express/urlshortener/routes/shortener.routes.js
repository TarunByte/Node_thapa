import { Router } from "express";
import {
  postURLShortener,
  getShortnerPage,
  redirectToShortLink,
} from "../controllers/postshortener.controller.js";

const router = Router();

router.get("/", getShortnerPage);

router.post("/", postURLShortener);

router.get("/:shortCode", redirectToShortLink);

//default export
// export default router;

// Named export
export const shortenerRoutes = router;
