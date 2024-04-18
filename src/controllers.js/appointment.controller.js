import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";

export const createAppointment = async (req, res, next) => {
    try {
        const { doctorName, patientName, day, date, time } = req.body;
        const doctor = await Doctor.findOne({ name: doctorName });
        if (!doctor) {
            return next(new AppError(404, "Doctor not found"));
        }

        if (doctor.maxPatients <= doctor.appointments.length) {
            return next(
                new AppError(400, "Cannot book as doctor is fully booked")
            );
        }

        if (doctor.appointments.length > 0 && day && date && time) {
            let done = false;
            doctor.appointments.forEach((appointment) => {
                if (appointment === date + " " + day + " " + time) {
                    done = true;
                    return;
                }
            });

            if (done) {
                return next(new AppError(400, "Time slot already booked"));
            }
        }

        const appointment = await Appointment.create({
            doctorName,
            patientName,
            day,
            date,
            time,
        });

        doctor.appointments.push(date + " " + day + " " + time);
        await doctor.save();

        return res
            .status(201)
            .json(new ApiResponse(201, "Appointment created", appointment));
    } catch (error) {
        if (error.name === "ValidationError") {
            error.message = "Please check your input";
        }
        console.log(error);
        return next(
            new AppError(
                500,
                error.message || "An error occurred while creating appointment"
            )
        );
    }
};

export const deleteAppointment = async (req, res, next) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        return res
            .status(200)
            .json(new ApiResponse(200, "Appointment deleted"));
    } catch (error) {
        console.log(error);
    }
};

export const getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find();
        return res
            .status(200)
            .json(new ApiResponse(200, "Appointments found", appointments));
    } catch (error) {
        console.log(error);
    }
};
