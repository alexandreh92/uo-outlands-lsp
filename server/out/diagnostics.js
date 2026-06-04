"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDocument = validateDocument;
const node_1 = require("vscode-languageserver/node");
function stripInlineComment(line) {
    // Remove // comments not inside strings
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === "'" && !inDouble) {
            inSingle = !inSingle;
            continue;
        }
        if (ch === '"' && !inSingle) {
            inDouble = !inDouble;
            continue;
        }
        if (!inSingle && !inDouble && ch === '/' && line[i + 1] === '/') {
            return line.substring(0, i);
        }
        if (!inSingle && !inDouble && ch === '#') {
            return line.substring(0, i);
        }
    }
    return line;
}
function makeRange(line, col, endCol) {
    return {
        start: { line, character: col },
        end: { line, character: endCol },
    };
}
function validateDocument(textDocument) {
    var _a;
    const diagnostics = [];
    const text = textDocument.getText();
    const lines = text.split(/\r?\n/);
    const stack = [];
    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const stripped = stripInlineComment(rawLine);
        const trimmed = stripped.trimStart();
        const indent = rawLine.length - rawLine.trimStart().length;
        if (!trimmed)
            continue;
        // Extract first token, ignoring leading '@'
        const withoutAt = trimmed.startsWith('@') ? trimmed.slice(1).trimStart() : trimmed;
        const tokens = (_a = withoutAt.match(/\S+/g)) !== null && _a !== void 0 ? _a : [];
        if (tokens.length === 0 || tokens[0] === undefined)
            continue;
        const firstToken = tokens[0].toLowerCase();
        const tokenCol = rawLine.indexOf(tokens[0]);
        switch (firstToken) {
            case 'if': {
                // Check for expression after 'if'
                const afterIf = withoutAt.slice(2).trim();
                if (!afterIf) {
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Warning,
                        range: makeRange(i, tokenCol, tokenCol + 2),
                        message: "'if' statement is missing a condition expression.",
                        source: 'razor-uo',
                    });
                }
                stack.push({ type: 'if', line: i, column: tokenCol, keyword: 'if' });
                break;
            }
            case 'while': {
                const afterWhile = withoutAt.slice(5).trim();
                if (!afterWhile) {
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Warning,
                        range: makeRange(i, tokenCol, tokenCol + 5),
                        message: "'while' statement is missing a condition expression.",
                        source: 'razor-uo',
                    });
                }
                stack.push({ type: 'while', line: i, column: tokenCol, keyword: 'while' });
                break;
            }
            case 'for': {
                const afterFor = withoutAt.slice(3).trim();
                if (!afterFor) {
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Warning,
                        range: makeRange(i, tokenCol, tokenCol + 3),
                        message: "'for' statement is missing an iteration count.",
                        source: 'razor-uo',
                    });
                }
                stack.push({ type: 'for', line: i, column: tokenCol, keyword: 'for' });
                break;
            }
            case 'foreach': {
                stack.push({ type: 'for', line: i, column: tokenCol, keyword: 'foreach' });
                break;
            }
            case 'endif': {
                if (stack.length === 0 || stack[stack.length - 1].type !== 'if') {
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Error,
                        range: makeRange(i, tokenCol, tokenCol + 5),
                        message: 'Unexpected "endif" without a matching "if".',
                        source: 'razor-uo',
                    });
                }
                else {
                    stack.pop();
                }
                break;
            }
            case 'endwhile': {
                if (stack.length === 0 || stack[stack.length - 1].type !== 'while') {
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Error,
                        range: makeRange(i, tokenCol, tokenCol + 8),
                        message: 'Unexpected "endwhile" without a matching "while".',
                        source: 'razor-uo',
                    });
                }
                else {
                    stack.pop();
                }
                break;
            }
            case 'endfor': {
                if (stack.length === 0 || stack[stack.length - 1].type !== 'for') {
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Error,
                        range: makeRange(i, tokenCol, tokenCol + 6),
                        message: 'Unexpected "endfor" without a matching "for" or "foreach".',
                        source: 'razor-uo',
                    });
                }
                else {
                    stack.pop();
                }
                break;
            }
            case 'else':
            case 'elseif': {
                if (stack.length === 0 || stack[stack.length - 1].type !== 'if') {
                    diagnostics.push({
                        severity: node_1.DiagnosticSeverity.Error,
                        range: makeRange(i, tokenCol, tokenCol + firstToken.length),
                        message: `"${firstToken}" without a matching "if".`,
                        source: 'razor-uo',
                    });
                }
                break;
            }
        }
    }
    // Report any unclosed blocks
    for (const block of stack) {
        diagnostics.push({
            severity: node_1.DiagnosticSeverity.Error,
            range: makeRange(block.line, block.column, block.column + block.keyword.length),
            message: `Unclosed "${block.keyword}" block — missing "${block.type === 'if' ? 'endif' : block.type === 'while' ? 'endwhile' : 'endfor'}".`,
            source: 'razor-uo',
        });
    }
    return diagnostics;
}
//# sourceMappingURL=diagnostics.js.map