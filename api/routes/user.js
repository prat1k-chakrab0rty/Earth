import express from "express";
import verifyToken from "../verifyToken.js";
import users from "../db.js";

const router = express.Router();

router.get("/all", verifyToken, (req, res, next) => {
    try {
        res.status(200).json({ message: "Success", data: users });
    } catch (err) {
        next(error(500, err));
    }
});

export default router;