export default class StringUtils {
    static getPathFromFilePath(filePath: string): string {
        let splitPath = filePath.split("/");
        splitPath.pop();
        splitPath.push("");
        return splitPath.join("/");
    }
}