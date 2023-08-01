import express from "express";
import { Register, getUsers, Login, Logout } from "./../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "./../controllers/RefreshToken.js";

const router = express.Router();

// jwt : perlu access token ketika hit server

router.get("/users", verifyToken, getUsers); // tidak bisa diakses jika tidak login dan perlu access

router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
