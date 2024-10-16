import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.DuplicateFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const old_file_path = document.uri.fsPath;
            const old_file_name = path.basename(old_file_path, path.extname(old_file_path));
            const old_file_dir = path.dirname(old_file_path);
            const file_extension = path.extname(old_file_path);

            const match = old_file_name.match(/(.*?)(\d+)$/);
            let new_file_name: string;
            let counter: number;

            if (match) {
                new_file_name = match[1];
                counter = parseInt(match[2], 10) + 1;
            } else {
                new_file_name = old_file_name;
                counter = 1;
            }

            let new_file_path: string;
            do {
                new_file_path = path.join(old_file_dir, `${new_file_name}${counter}${file_extension}`);
                counter++;
            } while (fs.existsSync(new_file_path));

            const content = document.getText();

            fs.writeFile(new_file_path, content, (err) => {
                if (err) {
                    vscode.window.showErrorMessage('Writing to the file failed!');
                    return;
                }

                vscode.workspace.openTextDocument(new_file_path).then(doc => {
                    vscode.window.showTextDocument(doc, { preview: false });
                });
            });
        } else {
            vscode.window.showErrorMessage('There is no file for copying!');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
