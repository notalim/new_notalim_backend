import express from "express";
import { getLastTenChangelogs } from "../data/changelogs.js"; 
import kv from "../routes/redisClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const cacheKey = "changelogs";
    try {
        // Try to fetch from cache first
        const cachedChangelogs = await kv.get(cacheKey);
        if (cachedChangelogs) {
            return res.status(200).json(JSON.parse(cachedChangelogs));
        }

        // If not in cache, fetch from database
        const recentChangelogs = await getLastTenChangelogs();
        // Store in cache
        await kv.set(cacheKey, JSON.stringify(recentChangelogs), "EX", 3600); // Expires in 1 hour
        res.status(200).json(recentChangelogs);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;
