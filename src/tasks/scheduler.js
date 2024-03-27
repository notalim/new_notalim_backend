import axios from "axios";
import { changelogs } from "../config/mongoCollections.js";
import { getProjects } from "../data/projects.js";
import { insertChangelog, checkIfChangelogExists } from "../data/changelogs.js"; // Ensure these functions are implemented
import cron from "node-cron";
import { URL } from "url";
import dotenv from "dotenv";



const fetchGitHubDataForProject = async (project, type) => {
    try {
        const repoPath = new URL(project.githubLink).pathname;
        const since = new Date();
        // Fetch for the last month

        since.setMonth(since.getMonth() - 1);

        

        console.log(
            "Fetching",
            type,
            "for",
            project._id,
            "link",
            project.githubLink,
            "path",
            repoPath,
            "since",
            since.toISOString()
        );

        const response = await axios.get(
            `https://api.github.com/repos${repoPath}/${type}`, // 'commits' or 'pulls'
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                },
                params: {
                    since: since.toISOString(), // Only commits after this date
                },
            }
        );
        console.log("Received data for", type, ":", response.data);
        return response.data; // Array of data
    } catch (error) {
        console.error(
            `Error fetching ${type} for project ${project._id}:`,
            error
        );
        return null;
    }
};

const updateChangelogs = async () => {
    const projects = await getProjects();

    // drop the collection
    const changelogsCollection = await changelogs();
    await changelogsCollection.drop();
    // console.log("Updating changelogs for", projects.length, "projects");
    for (const project of projects) {
        // Fetch commits
        const commits = await fetchGitHubDataForProject(project, "commits");
        if (commits) {
            for (const commit of commits) {
                if (!(await checkIfChangelogExists(commit.sha))) {
                    await insertChangelog({
                        projectId: project._id,
                        type: "COMMIT",
                        projectName: project.shortTitle,
                        by: commit.commit.author.name,
                        dateTime: commit.commit.author.date,
                        message: commit.commit.message,
                    });
                }
            }
        }

        // Fetch pull requests (PRs)
        const pullRequests = await fetchGitHubDataForProject(project, "pulls");
        if (pullRequests) {
            for (const pr of pullRequests) {
                if (!(await checkIfChangelogExists(pr.id))) {
                    await insertChangelog({
                        projectId: project._id,
                        type: "PULL_REQUEST",
                        projectName: project.shortTitle, // Use the title from the project schema
                        by: pr.user.login,
                        dateTime: pr.created_at,
                        message: pr.title,
                    });
                }
            }
        }
    }
};

const scheduleChangelogUpdates = () => {
    // At 00:00 (midnight) every day
    cron.schedule("0 0 * * *", async () => {
        dotenv.config();
        await updateChangelogs();
    });
};

// scheduleChangelogUpdates();

export { scheduleChangelogUpdates, updateChangelogs };
