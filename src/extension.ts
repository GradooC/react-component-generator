// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
    INDEX_FILE_EXTENSION,
    INDEX_FILE_NAME,
    INDEX_SNIPPET_SETTING_KEY,
    STYLES_FILE_EXTENSION,
    STYLES_SNIPPET_SETTING_KEY,
    TSX_FILE_EXTENSION,
    TSX_SNIPPET_SETTING_KEY,
} from './constants';
import { createFile, getComponentName, toKebabCase } from './utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        'react-component-files-generator.createComponent',
        async (parentFolderUri: vscode.Uri) => {
            const componentName = await getComponentName();

            if (!componentName) {
                vscode.window.showErrorMessage("Component wasn't created as you didn't provide any component name");
                return;
            }

            const folderName = toKebabCase(componentName);
            const folderUri = vscode.Uri.joinPath(parentFolderUri, folderName);

            await createFile({
                fileName: toKebabCase(componentName),
                extension: TSX_FILE_EXTENSION,
                settingsKey: TSX_SNIPPET_SETTING_KEY,
                componentName,
                folderUri,
                shouldBeOpened: true,
            });

            await createFile({
                fileName: INDEX_FILE_NAME,
                extension: INDEX_FILE_EXTENSION,
                settingsKey: INDEX_SNIPPET_SETTING_KEY,
                componentName,
                folderUri,
            });

            await createFile({
                fileName: toKebabCase(componentName),
                extension: STYLES_FILE_EXTENSION,
                settingsKey: STYLES_SNIPPET_SETTING_KEY,
                componentName,
                folderUri,
            });

            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage('Component was created');
        }
    );

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
