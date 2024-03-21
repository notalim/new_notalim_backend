import express from "express";
import {
    createProject,
    getProjects,
    getProjectById,
} from "../data/projects.js";
import axios from "axios";

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
        
        console.log("req.body", req.body)

        const projectId = await createProject(req.body);
        res.status(201).json({ projectId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const projects = await getProjects();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
