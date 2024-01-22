import passport from "passport";
import local from 'passport-local'
import { usersModel } from "../Models/login.model.js";
import { createHash, isValidPassword} from '../dirname.js'

const LocalStrategy = local.Strategy;

const initializePassport =  () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: `email`}, async (req, username, password, done) => {

            const { first_name, last_name, email, age } = req.body;

            try {
                const exist = await usersModel.findOne({ email });
                
                if(exist) {
                    console.log("El usuario ya existe");
                    done(null, false)
                    }

                    const user = {
                        first_name, 
                        last_name, 
                        email, 
                        age, 
                        password: createHash(password)
                    };
                    
                    const result = await usersModel.create(user);

                    return done(null, result);

            } catch (error) {
                return done("Error registrando al usuario" + error)
            }
        }
    ))
}

passport.use('login', new LocalStrategy(
    {passReqToCallback: true, usernameField: `email`}, async (req, username, password, done) => {

        const { email } = req.body;

        try {
            const user = await usersModel.findOne({ email });
            console.log(`Usuario de ${user} encontrado`);

            if (!user) {
                console.warn("No existe un usuario con el email" + user);
                return done(null, false);
            }
        
            if (!isValidPassword(password, user)) { 
                    console.warn("El usuario o la contraseña no son correctas");
                    return done(null, false);
            }

            return done(null, user);

         }catch (error) {
            return done("El mail o contraseña es incorrecta" + error)
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser( async (id, done) => {
    try {
        let user = await usersModel.findById(id);
        done(null, user)
    } catch (error) {
        console.error("Error deserializando el usuario" + error);
    }
});

export default initializePassport;