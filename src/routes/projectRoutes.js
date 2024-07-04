import express from "express";
import {
    createProject,
    getProjects,
    getProjectById,
} from "../data/projects.js";
import axios from "axios";
import kv from "./redisClient.js"; 

const router = express.Router();

router.post("/", async (req, res) => {
    let repoPath;
    const { githubLink } = req.body;

    try {
        repoPath = new URL(githubLink).pathname;
    } catch (error) {
        return res.status(400).json({ error: "Invalid GitHub link" });
    }

    try {
        const commitsResponse = await axios.get(
            `https://api.github.com/repos${repoPath}/commits`
        );
        const latestCommitDate = commitsResponse.data[0]?.commit?.author?.date;

        const repoDetailsResponse = await axios.get(
            `https://api.github.com/repos${repoPath}`
        );
        const repoCreationDate = repoDetailsResponse.data.created_at;

        req.body.lastUpdateDate = latestCommitDate
            ? new Date(latestCommitDate)
            : null;
        req.body.uploadDate = repoCreationDate
            ? new Date(repoCreationDate)
            : null;

        const projectId = await createProject(req.body);
        await kv.del("projects"); // Invalidate cache when new project is added

        res.status(201).json({ projectId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    const cacheKey = "projects";
    try {
        const cachedProjects = await kv.get(cacheKey);
        if (cachedProjects) {
            return res.status(200).json(cachedProjects);
        }

        const projects = await getProjects();
        await kv.set(cacheKey, JSON.stringify(projects), { ex: 3600 }); // Cache for 1 hour
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error in GET /projects:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const project = await getProjectById(req.params.id);
        res.status(200).json(project);
    } catch (error) {
        res.status(404).json({ error: "Project not found" });
    }
});

export default router;
