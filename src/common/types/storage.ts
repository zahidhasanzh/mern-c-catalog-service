export interface FileData {
    filename: string;
    fileData: Buffer | ArrayBuffer;
}
export interface FileStorage {
    upload(data: FileData): Promise<void>;
    delete(filename: string): void;
    getObjectUri(filename: string): void;
}
