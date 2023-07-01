import * as vscode from 'vscode';

export type CreateFileParams = {
    fileName: string;
    componentName: string;
    extension: string;
    folderUri: vscode.Uri;
    settingsKey: string;
    shouldBeOpened?: boolean;
    skip?: boolean;
};
