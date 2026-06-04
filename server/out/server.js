"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const completionData_1 = require("./completionData");
const diagnostics_1 = require("./diagnostics");
// ---------------------------------------------------------------------------
// Connection & document manager
// ---------------------------------------------------------------------------
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
// ---------------------------------------------------------------------------
// Initialize
// ---------------------------------------------------------------------------
connection.onInitialize((_params) => {
    return {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["'", '"', ' ', '@'],
            },
            hoverProvider: true,
        },
    };
});
// ---------------------------------------------------------------------------
// Diagnostics on every document change
// ---------------------------------------------------------------------------
function validateAndPublish(document) {
    const diagnostics = (0, diagnostics_1.validateDocument)(document);
    connection.sendDiagnostics({ uri: document.uri, diagnostics });
}
documents.onDidOpen((e) => validateAndPublish(e.document));
documents.onDidChangeContent((e) => validateAndPublish(e.document));
documents.onDidSave((e) => validateAndPublish(e.document));
documents.onDidClose((e) => connection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] }));
function isInsideString(text) {
    let inSingle = false;
    let inDouble = false;
    for (const ch of text) {
        if (ch === "'" && !inDouble) {
            inSingle = !inSingle;
        }
        else if (ch === '"' && !inSingle) {
            inDouble = !inDouble;
        }
    }
    if (inSingle)
        return { inside: true, char: "'" };
    if (inDouble)
        return { inside: true, char: '"' };
    return { inside: false, char: '' };
}
function getCompletionContext(lineText, character) {
    const toCursor = lineText.substring(0, character);
    // Check if we are inside a string
    const stringState = isInsideString(toCursor);
    if (stringState.inside) {
        // Remove the @ prefix and leading whitespace to find the command
        const normalized = toCursor.trimStart().replace(/^@/, '').trimStart().toLowerCase();
        if (/^cast\s+['"]/.test(normalized))
            return 'spell-name';
        if (/^skill\s+['"]/.test(normalized))
            return 'skill-name';
        if (/^walk\s+['"]/.test(normalized))
            return 'direction';
        if (/^potion\s+['"]/.test(normalized))
            return 'potion-type';
        if (/^virtue\s+['"]/.test(normalized))
            return 'virtue-type';
        if (/^setability\s+['"]/.test(normalized))
            return 'ability-type';
        if (/^target\s+['"]/.test(normalized))
            return 'target-type';
        // In expression context: if skill '...'
        if (/^(if|elseif|while)(\s+not)?\s+skill\s+['"]/.test(normalized))
            return 'skill-name';
        return 'string-generic';
    }
    const normalized = toCursor.trimStart().replace(/^@/, '').trimStart().toLowerCase();
    // Outlands: findlayer <target> <layer> — offer layer names for second arg
    if (/^(if|elseif|while)(\s+not)?\s+findlayer\s+\S+\s+\w*$/i.test(normalized)) {
        return 'layer-name';
    }
    // Outlands: noto <mobile> = <notoriety> — offer notoriety values
    if (/^(if|elseif|while)(\s+not)?\s+noto\s+\S+\s+=\s*\w*$/i.test(normalized)) {
        return 'notoriety';
    }
    // Outlands: setskill <skill> <lock> — offer up/down/lock
    if (/^setskill\s+\S+\s+\w*$/i.test(normalized)) {
        return 'setskill-lock';
    }
    // Expression context: after if / elseif / while (with optional 'not')
    if (/^(if|elseif|while)(\s+not)?\s+\w*$/.test(normalized) ||
        /^(if|elseif|while)(\s+not)?\s+\w.*\b(and|or)\s+\w*$/.test(normalized)) {
        return 'expression';
    }
    // After 'and' or 'or' at any position in an expression line
    if (/\b(and|or)\s+\w*$/i.test(toCursor)) {
        return 'expression';
    }
    return 'command';
}
// ---------------------------------------------------------------------------
// Completion
// ---------------------------------------------------------------------------
connection.onCompletion((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document)
        return [];
    const pos = params.position;
    const lineText = document.getText({
        start: { line: pos.line, character: 0 },
        end: { line: pos.line, character: Number.MAX_SAFE_INTEGER },
    });
    const ctx = getCompletionContext(lineText, pos.character);
    switch (ctx) {
        case 'spell-name':
            return (0, completionData_1.buildStringCompletions)(completionData_1.SPELL_NAMES, node_1.CompletionItemKind.Value);
        case 'skill-name':
            return (0, completionData_1.buildStringCompletions)(completionData_1.SKILL_NAMES, node_1.CompletionItemKind.Value);
        case 'direction':
            return (0, completionData_1.buildStringCompletions)(completionData_1.DIRECTION_NAMES, node_1.CompletionItemKind.EnumMember);
        case 'potion-type':
            return (0, completionData_1.buildStringCompletions)(completionData_1.POTION_TYPES, node_1.CompletionItemKind.EnumMember);
        case 'virtue-type':
            return (0, completionData_1.buildStringCompletions)(completionData_1.VIRTUE_TYPES, node_1.CompletionItemKind.EnumMember);
        case 'ability-type':
            return (0, completionData_1.buildStringCompletions)(completionData_1.ABILITY_TYPES, node_1.CompletionItemKind.EnumMember);
        case 'target-type':
            return (0, completionData_1.buildStringCompletions)(completionData_1.TARGET_TYPES, node_1.CompletionItemKind.EnumMember);
        case 'layer-name':
            return (0, completionData_1.buildStringCompletions)(completionData_1.LAYER_NAMES, node_1.CompletionItemKind.EnumMember);
        case 'notoriety':
            return (0, completionData_1.buildStringCompletions)(completionData_1.NOTORIETY_TYPES, node_1.CompletionItemKind.EnumMember);
        case 'setskill-lock':
            return (0, completionData_1.buildStringCompletions)(completionData_1.SETSKILL_VALUES, node_1.CompletionItemKind.EnumMember);
        case 'string-generic':
            // Offer predefined variable names as possible string values
            return completionData_1.VARIABLE_COMPLETIONS.map((v) => ({
                ...v,
                insertText: v.label,
            }));
        case 'expression':
            return [
                ...completionData_1.EXPRESSION_COMPLETIONS,
                ...completionData_1.LOGICAL_COMPLETIONS,
                ...completionData_1.VARIABLE_COMPLETIONS,
            ];
        case 'command':
        default:
            return [
                ...completionData_1.COMMAND_COMPLETIONS,
                ...completionData_1.CONTROL_FLOW_COMPLETIONS,
                ...completionData_1.VARIABLE_COMPLETIONS,
            ];
    }
});
// ---------------------------------------------------------------------------
// Completion resolve — add full documentation
// ---------------------------------------------------------------------------
connection.onCompletionResolve((item) => {
    // Documentation is already set during item creation from HOVER_MAP.
    // This handler can be used for lazy-loading if needed in the future.
    return item;
});
// ---------------------------------------------------------------------------
// Hover
// ---------------------------------------------------------------------------
connection.onHover((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document)
        return null;
    const pos = params.position;
    const lineText = document.getText({
        start: { line: pos.line, character: 0 },
        end: { line: pos.line, character: Number.MAX_SAFE_INTEGER },
    });
    // Extract the word at the cursor position
    const word = getWordAtPosition(lineText, pos.character);
    if (!word)
        return null;
    const entry = completionData_1.HOVER_MAP.get(word.toLowerCase());
    if (!entry)
        return null;
    let content = `**${word}**\n\n\`${entry.syntax}\`\n\n${entry.description}`;
    if (entry.example) {
        content += `\n\n**Example:**\n\`\`\`\n${entry.example}\n\`\`\``;
    }
    return {
        contents: {
            kind: node_1.MarkupKind.Markdown,
            value: content,
        },
    };
});
function getWordAtPosition(line, character) {
    // Expand left
    let start = character;
    while (start > 0 && /\w/.test(line[start - 1]))
        start--;
    // Expand right
    let end = character;
    while (end < line.length && /\w/.test(line[end]))
        end++;
    if (start === end)
        return null;
    return line.substring(start, end);
}
// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map