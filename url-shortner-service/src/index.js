import express from 'express';
import { json } from 'node:stream/consumers';


const app = express();
const PORT = process.env.PORT ?? 8000;



//?     Middlewares
app.use(express.json())


//?     Routes
app.get('/', (req, res) => {
    return res.json({status: `Server is up and running....`});
});





//?     server listening
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));