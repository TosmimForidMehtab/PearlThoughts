import express from "express";
import {
    createDoctor,
    getDoctor,
    getDoctors,
    checkAvailability,
    deleteDoctor,
} from "../controllers.js/doctor.controller.js";

const router = express.Router();

router.route("/").get(getDoctors).post(createDoctor);
router.get("/:doctorId", getDoctor);
router.get("/:doctorId/availability", checkAvailability);
router.delete("/:doctorId", deleteDoctor);

export default router;
