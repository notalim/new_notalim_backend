import { projects } from "../config/mongoCollections.js";
import dotenv from "dotenv";

dotenv.config();

export async function createProject(projectData) {
    const projectsCollection = await projects();
    const insertInfo = await projectsCollection.insertOne(projectData);
    if (insertInfo.insertedCount === 0) throw "Could not add project";
    return insertInfo.insertedId;
}

export async function getProjectById(id) {
  const projectsCollection = await projects();
  const project = await projectsCollection.findOne({ _id: id });
  return project;
}

export async function getProjects() {
  const projectsCollection = await projects();
  const allProjects = await projectsCollection.find({}).toArray();
  return allProjects;
}
