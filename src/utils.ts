import * as vscode from 'vscode';
import type { CreateFileParams } from './types';
import {
    DEFAULT_STYLES_FILE_EXTENSION,
    SETTINGS_SECTION,
    STYLES_EXTENSION_SETTING_KEY,
} from './constants';

export async function getComponentName() {
    return await vscode.window.showInputBox({
        ignoreFocusOut: true,
        validateInput: validateComponentName,
        prompt: 'Please enter component name in pascal case',
        value: 'MyNewComponent',
    });
}

function validateComponentName(value: string) {
    const PASCAL_CASE_REGEXP = /^[A-Z][a-zA-Z\d]*$/;
    const isInPascalCase = PASCAL_CASE_REGEXP.test(value);

    if (!isInPascalCase) return 'Component name should be in pascal case';
}

export async function createFile({
    fileName,
    componentName,
    extension,
    folderUri,
    settingsKey,
    shouldBeOpened = false,
    skip = false,
}: CreateFileParams) {
    if (skip) return;

    const fileFullName = `${fileName}.${extension}`;
    const fileUri = vscode.Uri.joinPath(folderUri, fileFullName);

    const settings = vscode.workspace.getConfiguration(SETTINGS_SECTION);
    const contentFromSettings = settings.get<string>(settingsKey) || '';
    const formattedContent = getFormattedContent(contentFromSettings, componentName);
    const fileContent = Buffer.from(formattedContent);

    await vscode.workspace.fs.writeFile(fileUri, fileContent);

    if (shouldBeOpened) {
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document);
    }
}

function getFormattedContent(rawContent: string, componentName: string) {
    const settings = vscode.workspace.getConfiguration(SETTINGS_SECTION);
    const stylesFileExtension = settings.get<string>(STYLES_EXTENSION_SETTING_KEY) || DEFAULT_STYLES_FILE_EXTENSION;

    const REPLACERS = new Map([
        [/\${ext:style}/g, stylesFileExtension],
        [/\${name:pascal}/g, componentName],
        [/\${name:kebab}/g, toKebabCase(componentName)],
    ]);

    return Array.from(REPLACERS.entries()).reduce(
        (acc, [regExp, replacer]) => acc.replace(regExp, replacer),
        rawContent
    );
}

export function toKebabCase(value: string) {
    /** Matches any uppercase letter or a set of digits not at the start of the string */
    const UPPERCASE_REGEXP = /(?<!^)([A-Z]|\d+)/g;

    return value.replace(UPPERCASE_REGEXP, '-$1').toLocaleLowerCase();
}
