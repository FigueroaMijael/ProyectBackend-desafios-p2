import { Router } from "express";
import { usersModel } from "../Models/login.model.js" 

const route = Router()

route.get("/login", (req, res) => {
    res.render("login", {
        title: "vista del login",
        fileCss: "loginStyle.css"
    })
});

route.get("/register", (req, res) => {
    res.render("register", {
        title: "vista del resgister",
        fileCss: "registerStyle.css"
    })    
})

route.get("/profile", (req, res) => {
    res.render("profile", {
        title: "profile",
        fileCss: "profileStyle.css",
        user: req.session.user
            })    
})

export default route