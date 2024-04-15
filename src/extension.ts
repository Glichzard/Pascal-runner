import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('pascal-runner.debugPascal', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor && activeEditor.document.languageId === 'pascal') {
            const filePath = activeEditor.document.fileName;
            const fileName = path.basename(filePath, path.extname(filePath)); // Obtener el nombre del archivo sin la extensión
            const terminal = vscode.window.activeTerminal || vscode.window.createTerminal('Pascal Debug Terminal');
            terminal.show();
            const command = `fpc -Co -Cr -gl -Miso ${filePath}; ./${fileName}`;
            terminal.sendText(command, true);
        } else {
            vscode.window.showErrorMessage('Open a Pascal file to debug.');
        }
    });

    context.subscriptions.push(disposable);

    // Registrar un listener para el evento de guardado del documento
    vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        if (document.languageId === 'pascal') {
            vscode.commands.executeCommand('pascal-runner.debugPascal');
        }
    });
}

export function deactivate() {}