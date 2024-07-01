import express from "express";
import verifyToken from "../verifyToken.js";
import users, { connections } from "../db.js";

const router = express.Router();

router.get("/all", verifyToken, (req, res, next) => {
    try {
        const usersRes = users.slice();
        console.log("users",connections);
        usersRes.forEach(user => (user.isActive = (connections.find(connection => connection.uid == user.id) ? true : false)));
        res.status(200).json({ message: "Success", data: usersRes });
    } catch (err) {
        next(error(500, err));
    }
});
router.get("/:id", verifyToken, (req, res, next) => {
    try {
        const id = req.params.id;
        const user = users.find(user => user.id == id);
        const { password, ...restOfUser } = user;
        res.status(200).json({ message: "Success", data: restOfUser });
    } catch (err) {
        next(error(500, err));
    }
});
router.put("/chat/:id", verifyToken, (req, res, next) => {
    try {
        const id = req.params.id;
        const buddyId = req.body.id;
        const user = users.find(user => user.id == id);
        user.inchat = Number(buddyId);
        res.status(200).json({ message: "Success", data: "In chat room!" });
    } catch (err) {
        next(error(500, err));
    }
});

export default router;