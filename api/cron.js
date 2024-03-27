import { updateChangelogs } from "../src/tasks/scheduler.js";

export default async function (req, res) {
    if (req.method === "GET") {
        try {
            await updateChangelogs()
                .then(() => {
                    console.log("Initial changelog update complete.");
                })
                .catch((error) => {
                    console.error(
                        "Error during initial changelog update:",
                        error
                    );
                });
            res.status(200).send("Changelogs updated successfully");
        } catch (error) {
            console.error("Failed to update changelogs:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(405).send("Method Not Allowed");
    }
}
