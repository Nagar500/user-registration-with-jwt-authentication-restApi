const dotenv = require('dotenv')
dotenv.config()
const express =  require('express')
const cors = require('cors')
const connectdb = require('./config/connectdb.js')
const userRoutes = require('./routes/userRoutes.js')

const app = express()
const port = process.env.port
const DATABASE_URL = process.env.DATABASE_URL

//cors policy
app.use(cors())

//JSON
app.use(express.json())

//load routes
app.use('/api/user', userRoutes)

//database connection
connectdb(DATABASE_URL)

app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})
