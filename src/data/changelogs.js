import { ObjectId } from "mongodb";
import { changelogs } from "../config/mongoCollections.js";

export async function getLastTenChangelogs() {
    const changelogsCollection = await changelogs();
    return await changelogsCollection
        .find({})
        .sort({ dateTime: -1 })
        .limit(10)
        .toArray();
}

export async function insertChangelog(changelogData) {
    const changelogsCollection = await changelogs();
    const insertInfo = await changelogsCollection.insertOne(changelogData);
    if (insertInfo.insertedCount === 0) throw "Could not add changelog";
    return insertInfo.insertedId; 
}

export async function checkIfChangelogExists(identifier) {
    const changelogsCollection = await changelogs();
    const query = {
        $or: [{ "commit.sha": identifier }, { "pull_request.id": identifier }],
    };
    const changelog = await changelogsCollection.findOne(query);
    return changelog !== null; 
}

