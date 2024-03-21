import express from "express";
import dotenv from "dotenv";
import setupRoutes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());

setupRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
