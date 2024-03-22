import express from "express";
import { getLastTenChangelogs } from "../data/changelogs.js"; // Assuming this is the correct path

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const recentChangelogs = await getLastTenChangelogs();
        res.status(200).json(recentChangelogs);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
