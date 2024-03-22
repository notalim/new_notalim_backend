import express from "express";

import projectsRouter from "./projectRoutes.js";
import changelogRouter from "./changelogRoutes.js";

const router = express.Router();

const setupRoutes = (app) => {
    app.use("/", router);
    app.use("/projects", projectsRouter);
    app.use("/changelogs", changelogRouter);

    app.get("/", (req, res) => {
        res.status(200).send("This is the server root. 🙏");
    });

    app.use("*", (req, res) => {
        res.status(404).send({ error: "Not Found" });
    });
};

export default setupRoutes;
