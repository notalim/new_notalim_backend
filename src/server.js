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

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: true }));

setupRoutes(app);

// Schedule the recurring task
scheduleChangelogUpdates();

// Call the function to run it immediately
updateChangelogs()
    .then(() => {
        console.log("Initial changelog update complete.");
    })
    .catch((error) => {
        console.error("Error during initial changelog update:", error);
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
