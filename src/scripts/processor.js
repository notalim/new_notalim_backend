import axios from "axios";
import fs from "fs";

const readJsonFile = (filePath) => {
    try {
        const jsonString = fs.readFileSync(filePath, "utf8");
        const jsonData = JSON.parse(jsonString);
        return jsonData;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
};

const processor = async (projectData) => {
    const {
        githubLink,
        title,
        description,
        technologies,
        imageLink,
        releaseDate,
    } = projectData;
    const repoPath = new URL(githubLink).pathname;

    try {
        const commitsResponse = await axios.get(
            `https://api.github.com/repos${repoPath}/commits`
        );
        const latestCommitDate =
            commitsResponse.data[0]?.commit?.committer?.date;

        const repoDetailsResponse = await axios.get(
            `https://api.github.com/repos${repoPath}`
        );
        const repoCreationDate = repoDetailsResponse.data.created_at;

        // Enhance the projectData with new information
        const enhancedProjectData = {
            ...projectData,
            lastUpdateDate: latestCommitDate
                ? new Date(latestCommitDate).toISOString()
                : null,
            uploadDate: repoCreationDate
                ? new Date(repoCreationDate).toISOString()
                : null,
        };

        console.log(enhancedProjectData);

        fs.writeFileSync(
            `processedProjectData${enhancedProjectData.title}.json`,
            JSON.stringify(enhancedProjectData, null, 2)
        );
    } catch (error) {
        console.error(error.message);
    }
};

export default processor;

processor(readJsonFile("./projectData.json"));
