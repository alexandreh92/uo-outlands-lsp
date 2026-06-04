import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  HoverParams,
  Hover,
  MarkupKind,
  CompletionParams,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  COMMAND_COMPLETIONS,
  CONTROL_FLOW_COMPLETIONS,
  EXPRESSION_COMPLETIONS,
  LOGICAL_COMPLETIONS,
  VARIABLE_COMPLETIONS,
  HOVER_MAP,
  SPELL_NAMES,
  SKILL_NAMES,
  DIRECTION_NAMES,
  POTION_TYPES,
  VIRTUE_TYPES,
  ABILITY_TYPES,
  TARGET_TYPES,
  LAYER_NAMES,
  NOTORIETY_TYPES,
  SETSKILL_VALUES,
  buildStringCompletions,
} from './completionData';
import { validateDocument } from './diagnostics';

// ---------------------------------------------------------------------------
// Connection & document manager
// ---------------------------------------------------------------------------
const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments<TextDocument>(TextDocument);

// ---------------------------------------------------------------------------
// Initialize
// ---------------------------------------------------------------------------
connection.onInitialize((_params: InitializeParams): InitializeResult => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
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
function validateAndPublish(document: TextDocument): void {
  const diagnostics = validateDocument(document);
  connection.sendDiagnostics({ uri: document.uri, diagnostics });
}

documents.onDidOpen((e) => validateAndPublish(e.document));
documents.onDidChangeContent((e) => validateAndPublish(e.document));
documents.onDidSave((e) => validateAndPublish(e.document));
documents.onDidClose((e) =>
  connection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] })
);

// ---------------------------------------------------------------------------
// Context analysis
// ---------------------------------------------------------------------------
type CompletionContext =
  | 'command'        // Start of line — show commands + control flow
  | 'expression'     // After if/while/elseif — show expressions
  | 'logical'        // After expression — show and/or
  | 'spell-name'     // Inside string after 'cast'
  | 'skill-name'     // Inside string after 'skill' command or expression
  | 'direction'      // Inside string after 'walk'
  | 'potion-type'    // Inside string after 'potion'
  | 'virtue-type'    // Inside string after 'virtue'
  | 'ability-type'   // Inside string after 'setability'
  | 'target-type'    // Inside string after 'target'
  | 'layer-name'     // After 'findlayer target' — show layer names
  | 'notoriety'      // After 'noto mobile =' — show notoriety values
  | 'setskill-lock'  // After 'setskill skillname' — show up/down/lock
  | 'string-generic' // Inside string, generic
  | 'none';

function isInsideString(text: string): { inside: boolean; char: string } {
  let inSingle = false;
  let inDouble = false;
  for (const ch of text) {
    if (ch === "'" && !inDouble) { inSingle = !inSingle; }
    else if (ch === '"' && !inSingle) { inDouble = !inDouble; }
  }
  if (inSingle) return { inside: true, char: "'" };
  if (inDouble) return { inside: true, char: '"' };
  return { inside: false, char: '' };
}

function getCompletionContext(lineText: string, character: number): CompletionContext {
  const toCursor = lineText.substring(0, character);

  // Check if we are inside a string
  const stringState = isInsideString(toCursor);
  if (stringState.inside) {
    // Remove the @ prefix and leading whitespace to find the command
    const normalized = toCursor.trimStart().replace(/^@/, '').trimStart().toLowerCase();
    if (/^cast\s+['"]/.test(normalized)) return 'spell-name';
    if (/^skill\s+['"]/.test(normalized)) return 'skill-name';
    if (/^walk\s+['"]/.test(normalized)) return 'direction';
    if (/^potion\s+['"]/.test(normalized)) return 'potion-type';
    if (/^virtue\s+['"]/.test(normalized)) return 'virtue-type';
    if (/^setability\s+['"]/.test(normalized)) return 'ability-type';
    if (/^target\s+['"]/.test(normalized)) return 'target-type';
    // In expression context: if skill '...'
    if (/^(if|elseif|while)(\s+not)?\s+skill\s+['"]/.test(normalized)) return 'skill-name';
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
connection.onCompletion((params: CompletionParams): CompletionItem[] => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return [];

  const pos = params.position;
  const lineText = document.getText({
    start: { line: pos.line, character: 0 },
    end: { line: pos.line, character: Number.MAX_SAFE_INTEGER },
  });

  const ctx = getCompletionContext(lineText, pos.character);

  switch (ctx) {
    case 'spell-name':
      return buildStringCompletions(SPELL_NAMES, CompletionItemKind.Value);

    case 'skill-name':
      return buildStringCompletions(SKILL_NAMES, CompletionItemKind.Value);

    case 'direction':
      return buildStringCompletions(DIRECTION_NAMES, CompletionItemKind.EnumMember);

    case 'potion-type':
      return buildStringCompletions(POTION_TYPES, CompletionItemKind.EnumMember);

    case 'virtue-type':
      return buildStringCompletions(VIRTUE_TYPES, CompletionItemKind.EnumMember);

    case 'ability-type':
      return buildStringCompletions(ABILITY_TYPES, CompletionItemKind.EnumMember);

    case 'target-type':
      return buildStringCompletions(TARGET_TYPES, CompletionItemKind.EnumMember);

    case 'layer-name':
      return buildStringCompletions(LAYER_NAMES, CompletionItemKind.EnumMember);

    case 'notoriety':
      return buildStringCompletions(NOTORIETY_TYPES, CompletionItemKind.EnumMember);

    case 'setskill-lock':
      return buildStringCompletions(SETSKILL_VALUES, CompletionItemKind.EnumMember);

    case 'string-generic':
      // Offer predefined variable names as possible string values
      return VARIABLE_COMPLETIONS.map((v) => ({
        ...v,
        insertText: v.label,
      }));

    case 'expression':
      return [
        ...EXPRESSION_COMPLETIONS,
        ...LOGICAL_COMPLETIONS,
        ...VARIABLE_COMPLETIONS,
      ];

    case 'command':
    default:
      return [
        ...COMMAND_COMPLETIONS,
        ...CONTROL_FLOW_COMPLETIONS,
        ...VARIABLE_COMPLETIONS,
      ];
  }
});

// ---------------------------------------------------------------------------
// Completion resolve — add full documentation
// ---------------------------------------------------------------------------
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  // Documentation is already set during item creation from HOVER_MAP.
  // This handler can be used for lazy-loading if needed in the future.
  return item;
});

// ---------------------------------------------------------------------------
// Hover
// ---------------------------------------------------------------------------
connection.onHover((params: HoverParams): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;

  const pos = params.position;
  const lineText = document.getText({
    start: { line: pos.line, character: 0 },
    end: { line: pos.line, character: Number.MAX_SAFE_INTEGER },
  });

  // Extract the word at the cursor position
  const word = getWordAtPosition(lineText, pos.character);
  if (!word) return null;

  const entry = HOVER_MAP.get(word.toLowerCase());
  if (!entry) return null;

  let content = `**${word}**\n\n\`${entry.syntax}\`\n\n${entry.description}`;
  if (entry.example) {
    content += `\n\n**Example:**\n\`\`\`\n${entry.example}\n\`\`\``;
  }

  return {
    contents: {
      kind: MarkupKind.Markdown,
      value: content,
    },
  };
});

function getWordAtPosition(line: string, character: number): string | null {
  // Expand left
  let start = character;
  while (start > 0 && /\w/.test(line[start - 1])) start--;
  // Expand right
  let end = character;
  while (end < line.length && /\w/.test(line[end])) end++;

  if (start === end) return null;
  return line.substring(start, end);
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
documents.listen(connection);
connection.listen();
