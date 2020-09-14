export default class StringUtils {
    /**
     * Extracts the path from a filepath that includes the file
     * @param filePath the filepath to extract the path form
     */
    static getPathFromFilePath(filePath: string): string {
        let splitPath = filePath.split("/");
        splitPath.pop();
        splitPath.push("");
        return splitPath.join("/");
    }
}