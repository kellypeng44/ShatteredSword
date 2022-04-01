export default class LocalStorageDB {
    private key: string;
    constructor(key: string) {
        this.key = key;
    }

    /**
     * Read a json file from a path
     * @param JSONFilePath The path to the JSON file
     * @param callback Function to run after getting the JSON
     */
    readJSON(JSONFilePath: string, callback: Function): void {
        let xobj: XMLHttpRequest = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', JSONFilePath, true);
        xobj.onreadystatechange = function () {
            if ((xobj.readyState == 4) && (xobj.status == 200)) {
                callback(JSON.parse(xobj.responseText));
            }
        };
        xobj.send(null);
    }

    loadJSON(): object {
        return JSON.parse(localStorage.getItem(this.key));
    }

    saveJSON(value: object): void {
        localStorage.setItem(this.key, JSON.stringify(value));
    }

}