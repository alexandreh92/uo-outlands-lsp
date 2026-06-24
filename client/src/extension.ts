import * as path from 'path';
import { workspace, ExtensionContext, window } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext): void {
  const serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js')
  );

  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        execArgv: ['--nolazy', '--inspect=6009'],
      },
    },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'razor-outlands' },
      { scheme: 'untitled', language: 'razor-outlands' },
    ],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/*.razor'),
    },
  };

  client = new LanguageClient(
    'razor-outlands-lsp',
    'Razor UO Script Language Server',
    serverOptions,
    clientOptions
  );

  client.start().then(() => {
    // Language server is ready
  }).catch((err) => {
    window.showErrorMessage(`Razor UO LSP failed to start: ${err}`);
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
