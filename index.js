const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouter')



const app = express();
app.use(express.json())

const cors = require('cors');
app.use(cors());

const dotenv=require('dotenv')
dotenv.config()




const URL = process.env.URL;
app.use('/user', userRouter)
mongoose.connect(URL,
{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:true },() => {
console.log("MongoDB Connected");
})


const PORT = process.env.PORT || 9001

app.listen(PORT,() => console.log(`Server Running in the port ${PORT}`));
