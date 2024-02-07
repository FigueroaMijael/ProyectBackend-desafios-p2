import { Router } from "express";
import { usersModel } from '../Models/login.model.js';
import {authToken} from '../dirname.js';


const router = Router();

router.get("/:userId", authToken,
async (req, res) =>{
    const userId = req.params.userId;
    try {
        const user = await usersModel.findById(userId);
        if (!user) {
            res.status(202).json({message: "User not found with ID: " + userId});
        }
        res.json(user);
    } catch (error) {
        console.error("Error consultando el usuario con ID: " + userId);
    }
});


export default router;