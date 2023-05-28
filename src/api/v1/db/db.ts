import mongoose from 'mongoose';

export const dbConnection = async () => {
    await mongoose
    .connect("mongodb://localhost:27017/mental_health_analysis")
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error: any) => {
        console.error("Error connecting to database:", error);
    });
}