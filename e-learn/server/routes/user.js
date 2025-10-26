import express from "express";
import { register } from "../controllera/user.js";

const router = express.Router();

router.get("/user/register", register); // note: fixed 'regster' typo

export default router;
