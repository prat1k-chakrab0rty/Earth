import error from "./error.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    try {
        if (!accessToken) {
            //user not authenticated
            return next(error(401,"Not an authenticated user!"));
        }
        else{
            //has a token
            await jwt.verify(accessToken,process.env.JWTSecret,(err,data)=>{
                req.id=data.id;
                return next();
            });
        }
    }
    catch (err) {
        next(error());
    }
}

export default verifyToken;