import express from 'express';
import userRouter from './routes/user.routes.js';
import { attachUser } from './middleware/auth.middleware.js';


const app = express();
const PORT = process.env.PORT ?? 8000



//?     Middlewares
app.use(express.json());
app.use(attachUser); 
app.use('/user', userRouter)


//?     Routes
app.get('/', (req, res) => {
    return res.json({status: 'Server is up and running...'});
});


//?     Server Listening
app.listen(PORT, () => {
    console.log(`Server is listening on PORT:${PORT}`)
})

