import { Router } from "express";
import { usersModel } from "../Models/login.model.js";

const router = Router();

// register
router.post("/register", async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body;

    console.log("Registrando usuario:");
    console.log(req.body);
    
    const exist = await usersModel.findOne({ email });

    if(exist) {
        return res.status(400).send({status: 'error', msg: 'el usuario ya existe'})
    }

    const user = {
        first_name, 
        last_name, 
        email, 
        age, 
        password 
    };

    const result = await usersModel.create(user);
    res.send({status: "success", message: "Usuario creado con exito con ID " + result.id});
});

//Login
router.post("/login", async (req, res) => {

    const { email, password} = req.body;

    const user = await usersModel.findOne({email, password}) // el password al no estar hasheado podemos buscarlo directamente

    if( !user ){
        return res.status(401).send({ status: "error", error: "incorrect credentials" })
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo! :)" });
});

export default router