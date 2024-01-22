import { Router } from "express";
import { usersModel } from "../Models/login.model.js";
import { createHash, isValidPassword} from '../dirname.js'
import passport  from "passport";

const router = Router();

// register
router.post("/register", passport.authenticate('register', {
    failureRedirect: '/api/session/fail-register'
}), async (req, res) => {

    console.log("Registrando usuario:");
    res.status(201).send({status: "success", message: "Usuario creado con exito " });

});

//Login
router.post("/login", passport.authenticate('login', {
    failureRedirect: '/api/session/fail-login'
}), async (req, res) => {

    console.log("User found to login:");

    const user = req.user;
    console.log(user);
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };

    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo! :)" });
});

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

export default router