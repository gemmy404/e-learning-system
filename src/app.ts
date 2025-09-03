import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config({path: '../.env'});
const port = process.env.PORT || 5000;

app.use(express.json());


app.listen(port, () =>
    console.log(`Server running on port ${port}`)
);