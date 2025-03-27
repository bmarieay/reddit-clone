//packages
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

//utils
import connectToMongoDB from './database/connectToMongoDB.js';
import { finalErrorHandler, logError } from './middlewares/error.middleware.js';

//routes
import authRoutes from './routes/auth.route.js';
import subredditRoutes from './routes/subreddit.route.js';

const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));

//routes
app.use('/auth', authRoutes);
app.use('/r', subredditRoutes);

//custom error handlers
app.use(logError);
app.use(finalErrorHandler);


app.listen(PORT, () => {
    console.log(`Serving PORT ${PORT}`);
    connectToMongoDB();
})