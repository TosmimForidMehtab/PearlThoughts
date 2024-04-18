import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: [true, "Please provide doctor name"],
    },
    patientName: {
        type: String,
        required: [true, "Please provide pateint name"],
    },
    day: {
        type: String,
        required: [true, "Please provide a day"],
        enum: {
            values: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ],
            message: "Cannot book an appointment on {VALUE}",
        },
    },
    date: {
        type: Date,
        required: [true, "Please provide a date"],
    },
    time: {
        type: String,
        required: [true, "Please provide a time"],
        enum: {
            values: [
                "06:00",
                "06:30",
                "07:00",
                "07:30",
                "08:00",
                "08:30",
                "09:00",
                "09:30",
                "10:00",
                "10:30",
            ],
            message: "Cannot book an appointment at {VALUE}",
        },
    },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
