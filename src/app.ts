import express from 'express';
import dotenv from 'dotenv';
import {connectDb} from "./config/dbConnection.ts";

const app = express();
dotenv.config({path: '../.env'});
const port = process.env.PORT || 5000;

app.use(express.json());

(async () => {
    await connectDb();
    app.listen(port, () =>
        console.log(`Server running on port ${port}`)
    );
})();