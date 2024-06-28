import express from "express";
import error from "../error.js";
import users, { connections } from "../db.js";
import jwt from "jsonwebtoken";
import verifyToken from "../verifyToken.js";

const router = express.Router();

const expiryDate = new Date();
expiryDate.setFullYear(expiryDate.getFullYear() + 10)

router.post("/login", (req, res, next) => {
    const { email, password } = req.body;
    try {
        //check if both the fields non-empty
        if (!(email && password)) {
            return next(error(400, "Both fields are required!"));
        }
        else {
            //values are there in both the fields
            var user = users.find(user => user.email === email);
            //no such user with that mail id
            if (!user) {
                return next(error(401, "Wrong credentials!"));
            }
            else {
                //password mismatch
                if (user.password !== password) {
                    return next(error(401, "Wrong credentials!"));
                }
                else {
                    //password match
                    const accessToken = jwt.sign({ id: user.id }, process.env.JWTSecret);
                    const loginRes = {
                        message: "User login successfull!",
                        data: {
                            id: user.id,
                            email,
                            name: user.name
                        }
                    };
                    // return res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: 'strict' }).status(200).json(loginRes);
                    return res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: 'none', secure: true, expires: expiryDate }).status(200).json(loginRes);
                }
            }
        }
    } catch (err) {
        console.log(err);
        next(error(500, err));
    }
});

router.post("/register", (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        //check if both the fields non-empty
        if (!(name && email && password)) {
            return next(error(400, "All the fields are required!"));
        }
        else {
            //values are there in both the fields
            var user = users.find(user => user.email === email);
            //user exists with same email id
            if (user) {
                return next(error(401, "User is already there with this email id!"));
            }
            else {
                //no user with this email id
                users.push({ id: users.length + 1, name, email, password, date: new Date(), inchat: 0 });
                return res.status(201).json({ message: "User created successfully!", data: null });
            }
        }
    } catch (err) {
        console.log(err);
        next(error(500, err));
    }
});


router.post("/logout", verifyToken, (req, res, next) => {
    try {
        const indexToRemove = connections.findIndex(connection => req.id === connection.uid);
        connections.splice(indexToRemove, 1);
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expires: expiryDate
        });
        res.status(200).json({ message: "User logged out successfully!", data: null });
    } catch (err) {
        console.log(err);
        next(error(500, err));
    }
});

export default router;