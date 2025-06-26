import * as fs from "@tauri-apps/plugin-fs";

export class FileHandler {
    private static path: string = "resources";
    private static baseDir: fs.BaseDirectory = fs.BaseDirectory.Resource;
    private static textDecoder: TextDecoder = new TextDecoder();

    public static async getAllFiles(path: string = "") {
        const fileList: string[] = [];
	    (await fs.readDir(this.path + (path.length > 0 ? "/" + path : path), {baseDir: this.baseDir})).forEach(e => {
		    fileList.push(e.name);
	    });
        return fileList;
    }

    public static async getFileContents(fileName: string) {
        return this.textDecoder.decode(await fs.readFile(this.path + "/" + fileName, {baseDir: this.baseDir}));
    }

    public static getIsJSONFile(fileName: string) {
        return fileName.substring(fileName.length - 5, fileName.length) == ".json";
    }
}