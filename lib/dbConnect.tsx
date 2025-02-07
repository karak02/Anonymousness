import mongoose from "mongoose";


type Connectionobject = {
    isConnected?:number
}
const connection: Connectionobject = {}

async function dbConnect():Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to the database");
        return;
    }

    try {
       const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to the database");
    } catch (error) {
        console.log("database is not connect",error);
        process.exit(1)
    }
}
export default dbConnect;