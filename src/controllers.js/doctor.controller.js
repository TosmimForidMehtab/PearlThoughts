import { Doctor } from "../models/doctor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AppError } from "../utils/AppError.js";

export const getDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ doctorId: req.params.doctorId });
        if (!doctor) {
            return next(new AppError(404, "Doctor not found"));
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Doctor found", doctor));
    } catch (error) {
        if (error.name === "CastError") {
            error.message = "Invalid doctor ID";
        }

        next(
            new AppError(
                500,
                error.message || "An error occurred while getting doctor"
            )
        );
    }
};

export const getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find().sort({ name: 1 });
        const totalDoctors = await Doctor.countDocuments();
        doctors.totalDoctors = totalDoctors;
        return res
            .status(200)
            .json(new ApiResponse(200, "Doctors found", doctors));
    } catch (error) {
        next(new AppError(500, "An error occurred while getting doctors"));
    }
};

export const createDoctor = async (req, res, next) => {
    try {
        const { name, doctorId, maxPatients } = req.body;
        const doctor = await Doctor.create({
            name,
            doctorId,
            maxPatients,
        });
        return res
            .status(201)
            .json(new ApiResponse(201, "Doctor created", null));
    } catch (error) {
        if (error.name === "ValidationError") {
            error.message = "Invalid doctor data";
        }
        next(
            new AppError(
                500,
                error.message || "An error occurred while creating doctor"
            )
        );
    }
};

export const checkAvailability = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ doctorId: req.params.doctorId });
        const { day, date, time } = req.body;
        if (!doctor) {
            return next(new AppError(404, "Doctor not found"));
        }

        if (doctor.maxPatients <= doctor.appointments.length) {
            return res
                .status(200)
                .json(new ApiResponse(200, "Doctor is not available", null));
        }

        if (doctor.appointments.length > 0 && day && date && time) {
            doctor.appointments.forEach((appointment) => {
                if (
                    appointment.day === day &&
                    appointment.date.toString().split("T")[0] === date &&
                    appointment.time === time
                ) {
                    return res
                        .status(200)
                        .json(
                            new ApiResponse(
                                200,
                                "Doctor is not available",
                                null
                            )
                        );
                }
            });
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Doctor is available", null));
    } catch (error) {
        if (error.name === "CastError") {
            error.message = "Invalid doctor ID";
        }
        if (error.name === "ValidationError") {
            error.message = "Invalid appointment data";
        }
        next(
            new AppError(
                500,
                error.message || "An error occurred while checking availability"
            )
        );
    }
};

export const deleteDoctor = async (req, res, next) => {
    try {
        await Doctor.findByIdAndDelete(req.params.doctorId);
        return res
            .status(200)
            .json(new ApiResponse(200, "Doctor deleted", null));
    } catch (error) {
        next(new AppError(500, "An error occurred while deleting doctor"));
    }
};
