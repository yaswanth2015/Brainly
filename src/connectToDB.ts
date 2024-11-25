import mongoose from "mongoose";


async function connectToDB(dbUrl: string) {
    await mongoose.connect(dbUrl)
}

export default connectToDB