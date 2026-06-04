"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = require("path");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    const serverOptions = {
        run: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
        },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: {
                execArgv: ['--nolazy', '--inspect=6009'],
            },
        },
    };
    const clientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'razor-uo' },
            { scheme: 'untitled', language: 'razor-uo' },
        ],
        synchronize: {
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/*.uos'),
        },
    };
    client = new node_1.LanguageClient('razor-uo-lsp', 'Razor UO Script Language Server', serverOptions, clientOptions);
    client.start().then(() => {
        // Language server is ready
    }).catch((err) => {
        vscode_1.window.showErrorMessage(`Razor UO LSP failed to start: ${err}`);
    });
}
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
//# sourceMappingURL=extension.js.map