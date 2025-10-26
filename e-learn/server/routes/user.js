import express from "express";
import { register } from "../controllera/user.js";

const router = express.Router();

router.post("/user/register", register);

export default router;
