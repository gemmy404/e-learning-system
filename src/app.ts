import express from 'express';
import dotenv from 'dotenv';
import {connectDb} from "./config/dbConnection.ts";
import {router as mainRouter} from './routes/main.route';
import {errorHandler} from './middlwares/errorHandler';
import {notFoundResource} from './middlwares/notFoundResource';
import {swaggerDoc} from "./config/swagger.ts";

const app = express();
dotenv.config({path: '../.env'});
const port = process.env.PORT || 5000;

app.use(express.json());

swaggerDoc(app)

app.use('/api', mainRouter);

app.use(notFoundResource);
app.use(errorHandler);

(async () => {
    await connectDb();
    app.listen(port, () =>
        console.log(`Server running on port ${port}`)
    );
})();