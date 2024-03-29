import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURI, {
      useNewUrlParser:true,

      useUnifiedTopology: true,
    });

    console.log("Successful connection to data base the MONGODB ATLAS");
  } catch (error) {
    console.error("Connection error to data base the MONGODB ATLAS" + error);
    process.exit();
  }
}

export default connectToMongoDB 
