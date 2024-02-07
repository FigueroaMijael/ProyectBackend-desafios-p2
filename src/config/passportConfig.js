import passport from "passport";
import { usersModel } from "../Models/login.model.js";
import GithubStrategy from 'passport-github2'
import jwtStrategy from 'passport-jwt'
import dotenv from 'dotenv'

dotenv.config()


const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {

    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: process.env.JWT_PRIVATE_KEY
        }, async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del Payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));

    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });


    passport.deserializeUser(async (id, done) => {
        try {
            let user = await usersModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
};

passport.use('github', new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_URLCALLBACK
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log("Profile obtenido del usuario de github: ");
        console.log(profile);
        try {
            const user = await usersModel.findOne({emali: profile._json.email})
            console.log("Usuario encontrado para login:");
            console.log(user);
            if(!user) {
                console.warn("User doesn't exists with username: " + profile._json.email);
                let NewUser = {
                    first_name: profile._json.name,
                    last_name: ' ', 
                    email: profile._json.email, 
                    age: 28,
                    password: '',
                    loggedBy: 'GitHub'   
                }
                const result = await usersModel.create(NewUser);
                return done(null, result);
            } else {
                console.log('user exists')
                return done(null, user)
            }
            
        } catch (error) {
            return done(error)
        }
    }))

const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) {
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};

export default initializePassport;