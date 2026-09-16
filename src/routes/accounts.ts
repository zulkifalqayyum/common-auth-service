import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { isAuthenticated, requireJwtUser } from "../middleware/authMiddleware";
import {
  getUserProfileById,
  ProfileNotFoundError,
} from "../services/accountService";

const router = Router();

router.get(
  "/user",
  isAuthenticated,
  requireJwtUser,
  asyncHandler(async (req, res) => {
    try {
      const user = await getUserProfileById(req.user!.id);
      res.status(200).json({ message: "User profile retrieved successfully", user });
    } catch (err) {
      if (err instanceof ProfileNotFoundError) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }
      throw err;
    }
  }),
);

export default router;
