'use strict';

import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient';

import { Commands } from './commands';
import { lspmodule } from './lspmodule';
import { contentprovidermodule } from './contentprovidermodule';
import { stackanalysismodule } from './stackanalysismodule';
import { multimanifestmodule } from './multimanifestmodule';

let lspClient: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  let previewUri = vscode.Uri.parse('fabric8-analytics-widget://authority/fabric8-analytics-widget');

	let provider = new contentprovidermodule.TextDocumentContentProvider();  //new TextDocumentContentProvider();
  let registration = vscode.workspace.registerTextDocumentContentProvider('fabric8-analytics-widget', provider);

	let disposable = vscode.commands.registerCommand(Commands.TRIGGER_STACK_ANALYSIS, () => stackanalysismodule.triggerStackAnalyses(context, provider, previewUri));
  let disposableFullStack = vscode.commands.registerCommand(Commands.TRIGGER_FULL_STACK_ANALYSIS, () => multimanifestmodule.triggerFullStackAnalyses(context, provider, previewUri));

  lspmodule.invoke_f8_lsp(context, (disposableLSp) => {
    lspClient = disposableLSp;
	  context.subscriptions.push(disposable, registration, lspClient.start(), disposableFullStack);
  });

}

export function deactivate(): Thenable<void> {
	if (!lspClient) {
		return undefined;
	}
	return lspClient.stop();
}

