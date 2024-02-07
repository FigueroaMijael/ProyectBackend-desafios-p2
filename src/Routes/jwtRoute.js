import { Router } from 'express';
import { isValidPassword, generateJWToken, createHash } from '../dirname.js';
import { usersModel } from "../Models/login.model.js";
import passport  from "passport";

const router = Router();

router.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await usersModel.findOne({email: email});
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(400).send({error: "Not found", message: "Usuario no encontrado con username: " + email});
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({status:"error",error:"El usuario y la contraseña no coinciden!"});
        }
        const tokenUser= {
            name : `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);
        //Con Cookie
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 120000,
            httpOnly: true
        });
        res.send({message: "Login successful!"});

    } catch (error) {
        console.error(error);
        return res.status(500).send({status:"error",error:"Error interno de la applicacion."});
    }
});


/* router.post("/register",  async (req, res)=>{
    const {first_name ,last_name , email, age, password} = req.body;
    console.log("Registrando usuario:");
    console.log(req.body);

    const exists = await userService.findByUsername(email);
    if (exists){
        return res.status(401).send({status: "error", message: "Usuario ya existe."});
    }

    const user = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
    };

    const result = await userService.save(user);
    res.status(201).send({status: "success", message: "Usuario creado con extito con ID: " + result.id});
}); */

router.put("/Updatepassword", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Verificar si el usuario existe en la base de datos
        const user = await usersModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }

        // Cambiar la contraseña y actualizar en la base de datos
        const hashedPassword = createHash(newPassword);

        const updateResult = await usersModel.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );

        if (updateResult.modifiedCount > 0) {
            return res.status(200).send({ status: "success", message: "Contraseña cambiada exitosamente" });
        } else {
            return res.status(500).send({ status: "error", error: "Error al cambiar la contraseña" });
        }
    } catch (error) {
        console.error("Error en la ruta /change-password:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.get('/fail-register', (req, res) => {
    res.status(401).send({error: "Failed to process register"})
});

router.get('/fail-login', (req, res) => {
    res.status(401).send({error: "Failed to process login"})
});

router.get("/github", passport.authenticate('github', { scope: ['user:email']}),
async ( req, res ) => {
    { }
})

router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error'}),
async (req, res) => {

    const user = req.user;

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };

    req.session.admin = true;

    res.redirect("/users/profile");
})

export default router