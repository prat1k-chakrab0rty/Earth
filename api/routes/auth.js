import express from "express";
import error from "../error.js";
import users from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

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
                            name: user.name,
                            date: user.date
                        }
                    };
                    // return res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: 'strict' }).status(200).json(loginRes);
                    return res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: 'none',secure:true }).status(200).json(loginRes);
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
                users.push({ id: users.length + 1, name, email, password, date: new Date() });
                return res.status(201).json({ message: "User created successfully!", data: null });
            }
        }
    } catch (err) {
        console.log(err);
        next(error(500, err));
    }
});


router.post("/logout", (req, res, next) => {
    try {
        // res.clearCookie("accessToken", {
        //     httpOnly: true,
        //     sameSite: 'strict'
        // });
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: 'none',
            secure:true
        });

        res.status(200).json({ message: "User logged out successfully!", data: null });
    } catch (err) {
        next(error(500, err));
    }
});

export default router;