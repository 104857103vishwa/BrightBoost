import mongoose from 'mongoose';
require('dotenv').config();

const dbUrl:string = process.env.DB_URL || '';

const connectDatabase = async () => {
    try {
        await mongoose.connect(dbUrl).then((data:any) => {
            console.log(`Database connection successful at ${data.connection.host}`)
        })
    } catch (error:any) {
        console.log(error.message);
        setTimeout(connectDatabase, 5000);
    }
}

export default connectDatabase;