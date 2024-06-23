import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import setupRoutes from "./routes/index.js";

// Import the function
import {
    scheduleChangelogUpdates,
    updateChangelogs,
} from "./tasks/scheduler.js";

dotenv.config();
// console.log("GITHUB_TOKEN", process.env.GITHUB_TOKEN);

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: true }));

setupRoutes(app);

// await updateChangelogs();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    // scheduleChangelogUpdates();
    console.log(`Server running on port ${port}`);
});

export default app;
