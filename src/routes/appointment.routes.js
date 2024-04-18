import express from "express";
import {
    createAppointment,
    deleteAppointment,
    getAllAppointments,
} from "../controllers.js/appointment.controller.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.delete("/:id", deleteAppointment);

export default router;
