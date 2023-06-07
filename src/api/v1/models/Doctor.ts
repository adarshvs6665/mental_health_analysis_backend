import mongoose, { Document, Model, Schema } from "mongoose";

interface IDoctor extends Document {
    doctorId: string;
    name: string;
    password: string;
    mobile: string;
    email: string;
    verifyPassword(candidatePassword: string): boolean;
}

const DoctorSchema: Schema<IDoctor> = new mongoose.Schema({
    doctorId: String,
    name: String,
    password: String,
    mobile: String,
    email: String,
});

// Add a method to compare passwords
DoctorSchema.methods.verifyPassword = function (
    candidatePassword: string
): boolean {
    return candidatePassword === this.password;
};

const Doctor: Model<IDoctor> = mongoose.model<IDoctor>("Doctor", DoctorSchema);

export default Doctor;
