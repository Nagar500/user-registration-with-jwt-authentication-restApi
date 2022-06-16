const  mongoose =  require('mongoose')

const connectdb = async (DATABASE_URL)=>{
    try{
        const DB_NAME = {
            dbName:"studentRegister"
        }
        await mongoose.connect(DATABASE_URL, DB_NAME)
        console.log('connected successfully..')
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectdb