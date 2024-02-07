import path from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
    console.log(`Datos a validar: user-password : ${user.password}, password: ${password}`);

    return bcrypt.compareSync(password, user.password);
}

//generate token JWT
export const generateJWToken = (user) => {
    return jwt.sign({user}, process.env.JWT_PRIVATE_KEY, {expiresIn: '120s'});
};


// para manejo de errores
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ");
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};


// para manejo de Auth
export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT")

        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next()
    }
};

//authToken
export const authToken = (req,res,next) => {
    const authHeader = req.headers.authorization;
    console.log("Token present in header auth:");
    console.log(authHeader);

    if(!authHeader){
        return res.status(401).send({error: "User not authenticated or missing token"});
    }

    const token = authHeader.split('')[1];

    // validar token
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, credential) => {
        if(error) return res.status(403).send({error: "Token invalid, unauthorized!"})

        //token OK!
        req.user = credential.user;
        console.log(req.user);
        next();
    })
}

export default __dirname;
