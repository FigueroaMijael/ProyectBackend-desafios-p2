import { Schema, model } from "mongoose";

const usersSchema = new Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {
        type: String, 
        unique: true
    },
    age: {type: Number},
    password: {type: String}
})

const usersModel = model("users", usersSchema);

export {usersModel}