import { usersModel } from "../../Models/login.model.js";

export default class usersService {
    constructor() { 
        console.log("Working students with Database persistence in mongodb");
    }

    getAll = async () => {
        let users = await usersModel.find();
        return users.map( user => user.toObject());
    }
    save = async (users) => {
        let result = await usersModel.create(users);
        return result;
    }

    findByUsername = async (username) => {
        const result = await usersModel.findOne({email: username});
        return result;
    };

    update = async (filter, value) => {
        console.log("Update student with filter and value:");
        console.log(filter);
        console.log(value);
        let result = await usersModel.updateOne(filter, value);
        return result;
    }
}