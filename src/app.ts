import express from 'express';
import dotenv from 'dotenv';
import {router as authRouter} from './routes/auth.route';
import {connectDb} from "./config/dbConnection.ts";

const app = express();
dotenv.config({path: '../.env'});
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRouter);

(async () => {
    await connectDb();
    app.listen(port, () =>
        console.log(`Server running on port ${port}`)
    );
})();