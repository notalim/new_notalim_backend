import { changelogs } from "../config/mongoCollections.js";

export async function getLastTenChangelogs() {
    const changelogsCollection = await changelogs();
    return await changelogsCollection
        .find({})
        .sort({ dateTime: -1 })
        .limit(10)
        .toArray();
}
