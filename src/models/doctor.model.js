import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            minLength: [3, "Name must be at least 3 characters long"],
            maxLength: [50, "Name must be at most 50 characters long"],
            unique: true,
        },
        doctorId: {
            type: String,
            required: [true, "Please provide a doctorId"],
            minLength: [7, "DoctorId must be at least 7 characters long"],
            unique: true,
        },
        maxPatients: {
            type: Number,
            default: 3,
        },
        appointments: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
