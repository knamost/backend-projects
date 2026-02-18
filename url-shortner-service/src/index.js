import express from 'express';
import userRouter from './routes/user.routes.js'

const app = express();
const PORT = process.env.PORT ?? 8000;



//?     Middlewares
app.use(express.json());
app.use('/user', userRouter)


//?     Routes
app.get('/', (req, res) => {
    return res.json({status: `Server is up and running....`});
});



//?     server listening
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));