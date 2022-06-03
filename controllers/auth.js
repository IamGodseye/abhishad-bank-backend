import { hashPassword, comparePassword, getRandomNumber } from "../utils/index";
import User from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name) throw Error("Name is required");

        if (!password || password.length < 8) throw Error("Password is required and should be min of 8 characters")
        let userExist = await User.findOne({ name: name.toUpperCase() }).exec();
        if (userExist) throw Error("Name is taken");
        const hashedPassword = await hashPassword(password);

        let accountNumber = '9565858906156026';
        //getRandomNumber(16);
        console.log(accountNumber)
        let accountNumberExist = await User.findOne({ accountNumber })
        // console.log(accountNumberExist)

        // If account Number exist then regenerate - a very rare case but possible
        while (accountNumberExist !== null) {
            accountNumber = getRandomNumber(16)
            accountNumberExist = await User.findOne({ accountNumber })
            // console.log(accountNumberExist)
        }

        const user = new User({ name: name.toUpperCase(), password: hashedPassword, accountNumber });
        await user.save();
        return res.json({ ok: true, message: 'User is saved successfully' });
    }
    catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}

export const login = async (req, res) => {
    try {
        const { name, password } = req.body;
        const searchName = name.toUpperCase();
        console.log(searchName)
        const user = await User.findOne({ name: searchName }).exec();
        if (!user) throw Error("No user found");

        const matchPassword = await comparePassword(password, user.password);
        if (!matchPassword) throw Error("Wrong Password!!!");

        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
            expiresIn: "7d",
        });
        user.password = undefined;
        console.log(token)

        res.json({ ok: true, message: 'Login successful', user, token });
    } catch (error) {
        console.log(error);
        return res.json({ ok: false, message: error.message || 'Error...Try again....' })
    }
}