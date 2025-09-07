import express from 'express';
import dotenv from 'dotenv';
import {connectDb} from "./config/dbConnection.ts";
import {router as authRouter} from './routes/auth.route';
import {router as courseRouter} from './routes/course.route';
import {router as adminRouter} from './routes/admin.route';
import {errorHandler} from './middlwares/errorHandler';
import {notFoundResource} from './middlwares/notFoundResource';

const app = express();
dotenv.config({path: '../.env'});
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/admin', adminRouter);

app.use(notFoundResource);
app.use(errorHandler);

(async () => {
    await connectDb();
    app.listen(port, () =>
        console.log(`Server running on port ${port}`)
    );
})();