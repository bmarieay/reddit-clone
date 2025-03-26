//packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

//utils
import connectToMongoDB from './database/connectToMongoDB.js';

//routes
import authRoutes from './routes/auth.route.js';


dotenv.config();
const app = express();

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/auth', authRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serving PORT ${PORT}`);
    connectToMongoDB();
})