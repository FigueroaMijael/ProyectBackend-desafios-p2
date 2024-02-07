import { Router } from "express";
import { passportCall} from "../dirname.js";
import usersService from "../daos/dbManager/login.dao.js";

const userService = new usersService()

const router = Router()

router.get("/login", (req, res) => {
    res.render("login", {
        title: "vista del login",
        fileCss: "loginStyle.css"
    })
});

router.get("/register", (req, res) => {
    res.render("register", {
        title: "vista del resgister",
        fileCss: "registerStyle.css"
    })    
})

router.get("/profile", passportCall('jwt'), async(req,res)=>{
/*     const user = req.user;
    console.log("Estudiante logueado: " + user);
    let users = await userService.getAll();
    console.log(users);
    res.render('profile',{ users : users })    */

     //authToken, //-> Usando Authorization Bearer Token
    //passport.authenticate('jwt', {session: false}), //-> Usando JWT por Cookie
    //passportCall('jwt'), //-> Usando JWT por Cookie usando customCall
    //authorization('user'),

        res.render("profile", {
            user: req.user
        });
});

router.get("/updatePassword", (req, res) => {
    res.render("updatePassword", {
        title: "update Password",
        fileCss: "updatePassword.css",

            })    
})


router.get("/error", (req, res) => {
    res.render("error");
});


export default router