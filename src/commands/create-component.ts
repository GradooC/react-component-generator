import * as vscode from 'vscode';
import { createFile, getComponentName, toKebabCase } from '../utils';
import {
    INDEX_FILE_EXTENSION,
    INDEX_FILE_NAME,
    INDEX_SNIPPET_SETTING_KEY,
    IS_INDEX_ENABLED_SETTING_KEY,
    IS_STYLES_ENABLED_SETTING_KEY,
    SETTINGS_SECTION,
    STYLES_EXTENSION_SETTING_KEY,
    DEFAULT_STYLES_FILE_EXTENSION,
    STYLES_SNIPPET_SETTING_KEY,
    TSX_FILE_EXTENSION,
    TSX_SNIPPET_SETTING_KEY,
} from '../constants';

export async function createComponent(parentFolderUri: vscode.Uri) {
    const componentName = await getComponentName();

    if (!componentName) {
        vscode.window.showErrorMessage("Component wasn't created as you didn't provide any component name");
        return;
    }

    const settings = vscode.workspace.getConfiguration(SETTINGS_SECTION);
    const stylesFileExtension = settings.get<string>(STYLES_EXTENSION_SETTING_KEY) || DEFAULT_STYLES_FILE_EXTENSION;
    const isStylesEnabled = settings.get<boolean>(IS_STYLES_ENABLED_SETTING_KEY);
    const isIndexEnabled = settings.get<boolean>(IS_INDEX_ENABLED_SETTING_KEY);

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
        skip: !isIndexEnabled,
    });

    await createFile({
        fileName: toKebabCase(componentName),
        extension: stylesFileExtension,
        settingsKey: STYLES_SNIPPET_SETTING_KEY,
        componentName,
        folderUri,
        skip: !isStylesEnabled,
    });

    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Component was created');
}
