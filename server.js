import express from 'express'
import cors from "cors";
const fs = require('fs')
require("dotenv").config();
import mongoose from 'mongoose';

mongoose
    .connect(process.env.DATABASE, { useUnifiedTopology: true })
    .then(() => console.log("DB Connected......."))
    .catch((err) => console.log("DB Connection Err=>", err));


const morgan = require("morgan");
import csrf from "csurf";

const csrfProtection = csrf({ cookie: true });

const app = express()

app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));
app.use(cors());

fs.readdirSync("./routes").map((r) => {
    app.use("/api", require(`./routes/${r}`));
});
app.use((error, req, res, next) => {
    console.error("ERROR", error.stack)
    res.status(500).json({ message: error.message || 'Something broke on server-side!', error })
})
const port = process.env.PORT || 5500
app.listen(port, () => console.log(`Server is listening on port ${port}`))