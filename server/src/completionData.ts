import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
} from 'vscode-languageserver/node';

export interface DocEntry {
  syntax: string;
  description: string;
  example?: string;
}

// ---------------------------------------------------------------------------
// Hover / documentation map
// ---------------------------------------------------------------------------
export const HOVER_MAP = new Map<string, DocEntry>([
  // ─── Action Commands ────────────────────────────────────────────────────
  ['attack',        { syntax: 'attack (serial)',                              description: 'Attack a specific serial or variable tied to a serial.' }],
  ['cast',          { syntax: "cast ('name of spell')",                       description: 'Cast a spell by name.', example: "cast 'greater heal'\nwft\ntarget 'self'" }],
  ['classicuo',     { syntax: "classicuo ('setting') ('value')",              description: 'Change a setting in your current ClassicUO profile. Use `>cuo list` to get a list of settings.' }],
  ['cuo',           { syntax: "cuo ('setting') ('value')",                    description: 'Alias for classicuo. Change a setting in your current ClassicUO profile.' }],
  ['cleardragdrop', { syntax: 'cleardragdrop',                                description: "Clears Razor's drag/drop queue." }],
  ['clearhands',    { syntax: "clearhands ('left'/'right'/'both')",           description: 'Undress your hands based on the parameter.' }],
  ['cooldown',      { syntax: "cooldown ('name') [milliseconds]",             description: 'Trigger a named cooldown. As expression: check if cooldown is active or compare remaining time in ms.', example: "cooldown 'mycd' 30000\nif cooldown 'mycd' > 5000\n    overhead 'Still cooling down...'\nendif" }],
  ['dclick',        { syntax: "dclick (serial) or dclick ('left'/'right'/'hands')", description: "Double-click a specific item or mobile, or use the item in one of your hands." }],
  ['dclicktype',    { syntax: "dclicktype ('name'/'graphicId') [src] [hue] [qty] [range]", description: "Double-click an item type by name or graphic ID. Source can be a serial, 'self', 'backpack', or 'ground'.", example: "dclicktype 'dagger'\nwaitfortarget\ntargettype 'robe'" }],
  ['dress',         { syntax: "dress ('name of dress list') or dress (serial)", description: 'Execute a saved dress list or dress a specific serial.' }],
  ['drop',          { syntax: 'drop (serial) (x) (y) [z] or drop (serial) (layer)', description: 'Drop the item you are holding at a location or on a specific layer.', example: "lift '0x400D54A7'\ndrop 'self' InnerTorso" }],
  ['droprelloc',    { syntax: 'droprelloc (x) (y)',                           description: "Drop the item you're holding at a location relative to your position." }],
  ['getlabel',      { syntax: "getlabel ('serial') ('variable name')",        description: "Get the label (single-click text) of an item or mobile and save it to a variable." }],
  ['hotkey',        { syntax: "hotkey ('name of hotkey')",                    description: 'Execute any Razor hotkey by name.' }],
  ['interrupt',     { syntax: "interrupt ['layer']",                          description: 'Interrupt a casting action. Optionally specify a layer.' }],
  ['lift',          { syntax: "lift ('serial') ['amount'] ['timeout']",       description: 'Lift a specific item and amount. Default amount: 1. Default timeout: 30000ms.' }],
  ['lifttype',      { syntax: "lifttype ('gfx'/'name') [amount] [src] [hue]",  description: "Lift an item type by graphic ID or name. Source limited to 'backpack', 'self', or 'ground'." }],
  ['music',         { syntax: "music ('index')",                              description: 'Play music based on the ID from Music/Digital/Config.txt.' }],
  ['potion',        { syntax: "potion ('heal'/'cure'/'refresh'/'nightsight'/'ns'/'explosion'/'strength'/'str'/'agility')", description: 'Use a specific potion by type.' }],
  ['rename',        { syntax: "rename (serial) ('name')",                     description: 'Attempt to rename a mobile.' }],
  ['random',        { syntax: "random ('max number')",                        description: 'Generate a random number between 1 and max. Result is placed in system message queue.' }],
  ['script',        { syntax: "script ('name') or script ('category\\\\name')", description: 'Call another script. Supports category paths using backslash.' }],
  ['setability',    { syntax: "setability ('primary'/'secondary'/'stun'/'disarm') ['on'/'off']", description: "Set a specific special move ability on or off. Default: 'on'." }],
  ['setvar',        { syntax: "setvar ('variable') ['serial'] ['timeout']",   description: 'Pause the script until a target is selected and assign it to a variable. Use `setvar!` for temp variables.' }],
  ['setvariable',   { syntax: "setvariable ('variable') ['serial'] ['timeout']", description: 'Alias for setvar.' }],
  ['skill',         { syntax: "skill ('name of skill') or skill last",        description: 'Use a specific skill by name.', example: "skill 'meditation'\nwait 11000" }],
  ['sound',         { syntax: "sound ('serial')",                             description: 'Play a specific sound by serial ID.' }],
  ['unsetvar',      { syntax: "unsetvar ('variable')",                        description: 'Remove a variable from the variable list. Use `unsetvar!` for temp variables.' }],
  ['virtue',        { syntax: "virtue ('honor'/'sacrifice'/'valor')",         description: 'Invoke Honor, Sacrifice or Valor.' }],
  ['walk',          { syntax: "walk ('North'/'South'/'East'/'West'/'Up'/'Down'/'Left'/'Right')", description: 'Turn and/or walk your player in a direction.' }],
  ['wait',          { syntax: 'wait (milliseconds) or wait (duration) (s/m)',  description: 'Pause script execution. 1000ms = 1 second. Shorthand: s (seconds), m (minutes).', example: 'wait 5000\nwait 5 s\nwait 1 m' }],
  ['pause',         { syntax: 'pause (milliseconds)',                          description: 'Alias for wait. Pause script execution.' }],
  ['undress',       { syntax: "undress ['name'/'LayerName'/serial]",          description: 'Undress entirely, or undress by dress list name, layer, or serial.' }],

  // ─── Agent Commands ──────────────────────────────────────────────────────
  ['organizer',     { syntax: "organizer ('number') ['set']",                 description: "Execute a specific organizer agent. Include 'set' to set the agent's hotbag." }],
  ['restock',       { syntax: "restock ('number') ['set']",                   description: "Execute a specific restock agent. Include 'set' to set the agent's hotbag." }],
  ['scavenger',     { syntax: "scavenger ('clear'/'add'/'on'/'off'/'set')",   description: 'Control the scavenger agent. Actions: clear, add, on, off, set.' }],
  ['sell',          { syntax: 'sell',                                         description: "Set the Sell agent's hotbag." }],
  ['useonce',       { syntax: "useonce ['add'/'addcontainer']",               description: 'Execute the UseOnce agent. Use add/addcontainer to populate the list.' }],

  // ─── Gumps / Menus / Prompts ─────────────────────────────────────────────
  ['gumpresponse',  { syntax: "gumpresponse ('buttonID')",                    description: 'Respond to a specific gump button by ID.' }],
  ['gumpclose',     { syntax: "gumpclose ['gumpID']",                         description: 'Close the last gump, or a specific gump by ID.' }],
  ['menu',          { syntax: "menu (serial) (index) ['false']",              description: 'Select a context menu item by index. Pass false to prevent Razor from blocking the menu.' }],
  ['menuresponse',  { syntax: "menuresponse ('index') ('menuId') ['hue']",    description: 'Respond to a specific menu and menu ID. Not for context menus — use menu instead.' }],
  ['promptresponse',{ syntax: "promptresponse ('prompt response')",           description: 'Respond to a prompt (e.g., renaming runes).', example: "dclicktype 'rune'\nwaitforprompt\npromptresponse 'to home'" }],
  ['waitforgump',   { syntax: "waitforgump (gumpId/'any') [timeout]",         description: "Wait for a gump. Default timeout: 30s. Use 'any' to wait for any gump." }],
  ['waitformenu',   { syntax: "waitformenu (menuId/'any') [timeout]",         description: "Wait for a menu. Default timeout: 30s. Use 'any' for any menu." }],
  ['waitforprompt', { syntax: "waitforprompt (promptId/'any') [timeout]",     description: "Wait for a prompt. Default timeout: 30s. Use 'any' for any prompt." }],

  // ─── Ignore Commands ─────────────────────────────────────────────────────
  ['clearignore',   { syntax: 'clearignore',                                  description: 'Clear the scripting ignore list.' }],
  ['ignore',        { syntax: "ignore ('serial'/'list name')",                description: 'Add a serial or list to the ignore list (used with findtype).' }],
  ['unignore',      { syntax: "unignore ('serial'/'list name')",              description: 'Remove a serial or list from the ignore list.' }],

  // ─── List Commands ───────────────────────────────────────────────────────
  ['clearlist',     { syntax: "clearlist ('list name')",                      description: 'Clear all items from a list without removing the list itself.' }],
  ['createlist',    { syntax: "createlist ('list name')",                     description: 'Create an empty named list.' }],
  ['poplist',       { syntax: "poplist ('list name') ('value'/'front'/'back')", description: "Remove an item from a list. Use 'front' or 'back' to remove by position." }],
  ['pushlist',      { syntax: "pushlist ('list name') ('item') ['front'/'back']", description: "Add an item to a list. Default appends to the end. Use 'front'/'back' to specify position." }],
  ['removelist',    { syntax: "removelist ('list name')",                     description: 'Completely remove a list and all its items.' }],

  // ─── Messaging Commands ──────────────────────────────────────────────────
  ['alliance',      { syntax: "alliance ('message')",                         description: 'Say a message on the alliance channel.' }],
  ['clearsysmsg',   { syntax: 'clearsysmsg',                                  description: "Clear Razor's internal system message queue." }],
  ['emote',         { syntax: "emote ('message') [hue]",                      description: 'Emote a message. Razor wraps it in * characters.' }],
  ['guild',         { syntax: "guild ('message')",                            description: 'Say a message on the guild channel.' }],
  ['overhead',      { syntax: "overhead ('text') ['color'] ['serial']",       description: 'Display text over your head. Only visible to you. Variable names are evaluated.' }],
  ['say',           { syntax: "say ('message') [hue]",                        description: 'Say a message in public chat.' }],
  ['msg',           { syntax: "msg ('message') [hue]",                        description: 'Alias for say.' }],
  ['sysmsg',        { syntax: "sysmsg ('message')",                           description: 'Display a message in the lower-left system message area.' }],
  ['waitforsysmsg', { syntax: "waitforsysmsg ('message') [timeout]",          description: 'Wait for a specific system message. Default timeout: 30s.' }],
  ['wfsysmsg',      { syntax: "wfsysmsg ('message') [timeout]",               description: 'Alias for waitforsysmsg.' }],
  ['whisper',       { syntax: "whisper ('message') [hue]",                    description: 'Whisper a message.' }],
  ['yell',          { syntax: "yell ('message') [hue]",                       description: 'Yell a message.' }],

  // ─── Targeting Commands ──────────────────────────────────────────────────
  ['clearall',      { syntax: 'clearall',                                     description: 'Cancel current target, clear target queue, drop held item, and clear drag/drop queue.' }],
  ['lasttarget',    { syntax: 'lasttarget',                                   description: "Target your last target set in Razor.", example: "cast 'magic arrow'\nwaitfortarget\nlasttarget" }],
  ['setlasttarget', { syntax: "setlasttarget ('serial')",                     description: 'Set the last target to a specific serial.' }],
  ['target',        { syntax: "target ('closest'/'random'/'next'/'prev') [types] [humanoid/monster] or target (serial) or target (clear/cancel)", description: "Target a mobile. Types can be: nonfriendly, friendly, enemy, red, gray, criminal, blue, friend, humanoid, monster." }],
  ['targetrelloc',  { syntax: 'targetrelloc (x-offset) (y-offset)',           description: 'Target a location relative to your current position.' }],
  ['targetloc',     { syntax: 'targetloc (x) (y) (z)',                        description: 'Target a specific map coordinate.' }],
  ['targettype',    { syntax: "targettype ('name'/'graphicId') [src] [hue] [qty] [range]", description: "Target a specific item or mobile type. Source can be a serial, 'self', 'backpack', or 'ground'." }],
  ['waitfortarget', { syntax: 'waitfortarget [timeout]',                      description: "Wait for a target cursor. Default timeout: 30s.", example: "cast 'energy bolt'\nwaitfortarget\ntarget 'last'" }],
  ['wft',           { syntax: 'wft [timeout]',                                description: 'Alias for waitfortarget.' }],

  // ─── Timer Commands ──────────────────────────────────────────────────────
  ['createtimer',   { syntax: "createtimer ('name')",                         description: 'Create a timer that starts counting up from 0 immediately.' }],
  ['removetimer',   { syntax: "removetimer ('name')",                         description: 'Remove and delete a specific timer.' }],
  ['settimer',      { syntax: "settimer ('name') ('milliseconds')",           description: 'Set a timer to a specific value (in ms) and start counting up.' }],

  // ─── Expressions ────────────────────────────────────────────────────────
  ['hp',            { syntax: 'hp',                                           description: 'Current hit points / health.' }],
  ['hits',          { syntax: 'hits',                                         description: 'Alias for hp. Current hit points.' }],
  ['maxhp',         { syntax: 'maxhp',                                        description: 'Maximum hit points.' }],
  ['maxhits',       { syntax: 'maxhits',                                      description: 'Alias for maxhp. Maximum hit points.' }],
  ['mana',          { syntax: 'mana',                                         description: 'Current mana.' }],
  ['maxmana',       { syntax: 'maxmana',                                      description: 'Maximum mana.' }],
  ['stam',          { syntax: 'stam',                                         description: 'Current stamina.' }],
  ['maxstam',       { syntax: 'maxstam',                                      description: 'Maximum stamina.' }],
  ['str',           { syntax: 'str',                                          description: 'Current strength stat.' }],
  ['dex',           { syntax: 'dex',                                          description: 'Current dexterity stat.' }],
  ['int',           { syntax: 'int',                                          description: 'Current intelligence stat.' }],
  ['weight',        { syntax: 'weight',                                       description: 'Current weight carried.' }],
  ['maxweight',     { syntax: 'maxweight',                                    description: 'Maximum weight allowed.' }],
  ['followers',     { syntax: 'followers',                                    description: 'Current number of followers.' }],
  ['maxfollowers',  { syntax: 'maxfollowers',                                 description: 'Maximum number of followers allowed.' }],
  ['diffhits',      { syntax: 'diffhits',                                     description: 'Difference between max HP and current HP.' }],
  ['diffhp',        { syntax: 'diffhp',                                       description: 'Alias for diffhits.' }],
  ['diffmana',      { syntax: 'diffmana',                                     description: 'Difference between max mana and current mana.' }],
  ['diffstam',      { syntax: 'diffstam',                                     description: 'Difference between max stamina and current stamina.' }],
  ['diffweight',    { syntax: 'diffweight',                                   description: 'Difference between max weight and current weight.' }],
  ['hidden',        { syntax: 'hidden',                                       description: 'Returns true if your character is currently hidden.' }],
  ['mounted',       { syntax: 'mounted',                                      description: 'Returns true if your character is currently mounted.' }],
  ['paralyzed',     { syntax: 'paralyzed',                                    description: 'Returns true if your character is currently paralyzed.' }],
  ['poisoned',      { syntax: 'poisoned',                                     description: 'Returns true if your character is currently poisoned.' }],
  ['warmode',       { syntax: "warmode or warmode ('on'/'off')",              description: "As expression: returns true if in war/combat mode. As command (Outlands): explicitly set war mode state." }],
  ['invuln',        { syntax: 'invuln',                                       description: 'Returns true if your character is invulnerable (blessed).' }],
  ['invul',         { syntax: 'invul',                                        description: 'Alias for invuln.' }],
  ['blessed',       { syntax: 'blessed',                                      description: 'Alias for invuln. Returns true if invulnerable.' }],
  ['lhandempty',    { syntax: 'lhandempty',                                   description: 'Returns true if your left hand is empty.' }],
  ['rhandempty',    { syntax: 'rhandempty',                                   description: 'Returns true if your right hand is empty.' }],
  ['name',          { syntax: 'name',                                         description: "Returns the name of the currently logged-in character." }],
  ['position',      { syntax: 'position (x, y) or position (x, y, z)',       description: 'Returns true if your current position matches the provided coordinates.' }],
  ['count',         { syntax: "count ('name'/'graphicId') [hue]",            description: 'Count items of a specific type in your backpack.' }],
  ['counter',       { syntax: "counter ('name')",                             description: 'Get the count of a named counter from the Counters tab.' }],
  ['findtype',      { syntax: "findtype ('name'/'graphicId') [src] [hue] [qty] [range]", description: "Check if a specific item type exists. Source can be a serial, 'self', 'backpack', or 'ground'. Use 'as' to assign to a variable.", example: "if findtype 'dagger' backpack as 'my_dagger'\n    dclick 'my_dagger'\nendif" }],
  ['insysmsg',      { syntax: "insysmsg ('text')",                            description: "Check if text appears in Razor's system message queue. Use `>sysmsgs` to see the queue." }],
  ['insysmessage',  { syntax: "insysmessage ('text')",                        description: 'Alias for insysmsg.' }],
  ['itemcount',     { syntax: 'itemcount',                                    description: "Return the current number of items you're carrying." }],
  ['queued',        { syntax: 'queued',                                       description: 'Returns true if a queue is active (from restocking, organizing, etc.).' }],
  ['targetexists',  { syntax: "targetexists ['any'/'beneficial'/'harmful'/'neutral']", description: 'Returns true if the client currently has a target cursor.' }],
  ['varexist',      { syntax: "varexist ('name')",                            description: 'Returns true if a variable with the given name exists.' }],
  ['varexists',     { syntax: "varexists ('name')",                           description: 'Alias for varexist.' }],
  ['findbuff',      { syntax: "findbuff ('buff name')",                       description: 'Returns true if a specific buff or debuff is currently applied to you.' }],
  ['inlist',        { syntax: "inlist ('list name') ('item')",                description: 'Returns true if a specific item is in the named list.' }],
  ['list',          { syntax: "list ('list name')",                           description: 'Returns the number of items in the named list.' }],
  ['listexists',    { syntax: "listexists ('list name')",                     description: 'Returns true if a list with the given name exists.' }],
  ['timer',         { syntax: "timer ('name')",                               description: 'Returns the elapsed time in milliseconds for the named timer.' }],
  ['timerexists',   { syntax: "timerexists ('name')",                         description: 'Returns true if a timer with the given name exists.' }],
  ['timerexist',    { syntax: "timerexist ('name')",                          description: 'Alias for timerexists.' }],

  // ─── Keywords ────────────────────────────────────────────────────────────
  ['if',            { syntax: 'if (expression) ... endif',                    description: 'Execute commands only if the expression is true. Must end with endif.', example: 'if hp < 50\n    cast \'greater heal\'\n    wft\n    target \'self\'\nendif' }],
  ['elseif',        { syntax: 'elseif (expression)',                          description: 'Alternative condition within an if block. Evaluated if the previous if/elseif was false.' }],
  ['else',          { syntax: 'else',                                         description: 'Default branch when all if/elseif conditions are false.' }],
  ['endif',         { syntax: 'endif',                                        description: 'Close an if/elseif/else block.' }],
  ['while',         { syntax: 'while (expression) ... endwhile',              description: 'Execute commands repeatedly while expression is true. Must end with endwhile.', example: 'while mana < maxmana\n    skill \'meditation\'\n    wait 11000\nendwhile' }],
  ['endwhile',      { syntax: 'endwhile',                                     description: 'Close a while loop.' }],
  ['for',           { syntax: 'for (number) ... endfor',                      description: 'Execute commands a specific number of times. Use `index` variable to track iteration. Must end with endfor.' }],
  ['foreach',       { syntax: "foreach ('var') in ('list') ... endfor",       description: 'Iterate over all items in a list. Must end with endfor.' }],
  ['endfor',        { syntax: 'endfor',                                       description: 'Close a for or foreach loop.' }],
  ['break',         { syntax: 'break',                                        description: 'Exit the closest enclosing for or while loop immediately.' }],
  ['continue',      { syntax: 'continue',                                     description: 'Skip to the next iteration of the closest enclosing for or while loop.' }],
  ['stop',          { syntax: 'stop',                                         description: 'Stop execution of the current script.' }],
  ['loop',          { syntax: 'loop',                                         description: 'Restart the script from the beginning indefinitely.' }],
  ['replay',        { syntax: 'replay',                                       description: 'Alias for loop. Restart the script from the beginning.' }],
  ['and',           { syntax: '(condition) and (condition)',                  description: 'Logical AND. Both conditions must be true.' }],
  ['or',            { syntax: '(condition) or (condition)',                   description: 'Logical OR. At least one condition must be true.' }],
  ['not',           { syntax: 'not (condition)',                              description: 'Logical NOT. Inverts the result of the condition.' }],
  ['as',            { syntax: '(expression) as (variable)',                   description: "Assign the result of findtype to a variable. Used as: `findtype 'item' as 'myvar'`." }],
  ['in',            { syntax: "(word) in (variable)",                         description: "Check if a word appears within a variable string. Used with getlabel." }],

  // ─── Pre-defined Variables ───────────────────────────────────────────────
  ['self',          { syntax: 'self',                                         description: 'The serial of your player character.' }],
  ['backpack',      { syntax: 'backpack',                                     description: "The serial of your character's backpack." }],
  ['hands',         { syntax: 'hands',                                        description: 'The serial of the item in either hand.' }],
  ['index',         { syntax: 'index',                                        description: 'The current loop iteration number (0-based). Available inside for/while loops.' }],
  ['lasttarget',    { syntax: 'lasttarget',                                   description: 'The serial of your current last target in Razor.' }],
  ['last',          { syntax: 'last',                                         description: 'Alias for lasttarget.' }],
  ['lastobject',    { syntax: 'lastobject',                                   description: 'The serial of your last used object in Razor.' }],
  ['lefthand',      { syntax: 'lefthand',                                     description: 'The serial of the item in your left hand.' }],
  ['righthand',     { syntax: 'righthand',                                    description: 'The serial of the item in your right hand.' }],
  ['ground',        { syntax: 'ground',                                       description: 'Represents the ground (used in drop commands).' }],

  // ─── Outlands Additions ──────────────────────────────────────────────────
  ['find',          { syntax: "find ('serial') [src] [hue] [qty] [range]",    description: 'Check if an item/mobile with the given serial exists. Parameters work like findtype.', example: "if find 0x4001A2 backpack\n    overhead 'Found it!'\nendif" }],
  ['findlayer',     { syntax: "findlayer ('target') ('layer') [as ('alias')]", description: 'Search a character for an equipped item on a specific layer.', example: "if findlayer self gloves as mygloves\n    overhead 'Wearing gloves!'\nendif" }],
  ['findtypelist',  { syntax: "findtypelist ('listname') ('name'/'graphicId') [src] [hue] [qty] [range]", description: 'Like findtype but adds all found serials to the named list.' }],
  ['noto',          { syntax: "noto ('mobile') = ('notoriety')",               description: 'Check the notoriety of a mobile. Valid values: innocent, friend, hostile, criminal, enemy, murderer, invulnerable.', example: "if noto lastObject = hostile\n    overhead 'Safe to attack!'\nendif" }],
  ['dead',          { syntax: "dead ('mobile')",                               description: 'Check if a mobile is dead.', example: "if dead someMobile\n    overhead \"He's dead, Jim!\"\nendif" }],
  ['hue',           { syntax: "hue ('object')",                                description: 'Get the hue/color value of an object.', example: "if hue someObject = 0x1809\n    overhead 'Found the right hue!'\nendif" }],
  ['counttype',     { syntax: "counttype ('name'/'graphicId') [src] [hue] [range]", description: 'Returns the count of matching items in a container. Stackable items return the stack size.' }],
  ['gumpexists',    { syntax: "gumpexists ('gumpId'/'any')",                   description: "Returns true if the specified gump is open. Use 'any' to check for any open gump." }],
  ['ingump',        { syntax: "ingump ('text') ['gumpId'/'any']",              description: "Returns true if the text appears in the given gump. Use 'any' for any open gump." }],
  ['bandaging',     { syntax: 'bandaging',                                     description: 'Returns remaining bandage time in seconds. Returns 0/false if not currently bandaging.', example: "if not bandaging\n    hotkey 'Bandage Self'\nendif" }],
  ['pvp',           { syntax: 'pvp',                                           description: 'Returns true if PvP script restrictions are active (structured PvP event or Faction flag).' }],
  ['casting',       { syntax: 'casting',                                       description: 'Returns true if the character is currently casting a spell.' }],
  ['atlist',        { syntax: "atlist ('list name') ('index') [as ('alias')]", description: 'Returns the element at the given 0-based index in a list. Use as to capture the value.', example: "if atlist mylist 0 as first\n    overhead first\nendif" }],
  ['finddebuff',    { syntax: "finddebuff ('debuff name')",                    description: 'Returns true if a specific debuff is currently applied to your character.' }],
  ['setskill',      { syntax: "setskill ('skill name') ('up'/'down'/'lock')",  description: 'Set the skill lock state for a skill. Valid values: up, down, lock.', example: "setskill 'Blacksmithing' up" }],
]);

// ---------------------------------------------------------------------------
// Spell Names
// ---------------------------------------------------------------------------
export const SPELL_NAMES: string[] = [
  // Magery Circle 1
  'clumsy', 'create food', 'feeblemind', 'heal', 'magic arrow', 'night sight', 'reactive armor', 'weaken',
  // Magery Circle 2
  'agility', 'cunning', 'cure', 'harm', 'magic trap', 'magic untrap', 'protection', 'strength',
  // Magery Circle 3
  'bless', 'fireball', 'magic lock', 'poison', 'telekinesis', 'teleport', 'unlock', 'wall of stone',
  // Magery Circle 4
  'arch cure', 'arch protection', 'curse', 'fire field', 'greater heal', 'lightning', 'mana drain', 'recall',
  // Magery Circle 5
  'blade spirits', 'dispel field', 'incognito', 'magic reflection', 'mind blast', 'paralyze', 'poison field', 'summon creature',
  // Magery Circle 6
  'dispel', 'energy bolt', 'explosion', 'invisibility', 'mark', 'mass curse', 'paralyze field', 'reveal',
  // Magery Circle 7
  'chain lightning', 'energy field', 'flamestrike', 'gate travel', 'mana vampire', 'mass dispel', 'meteor swarm', 'polymorph',
  // Magery Circle 8
  'earthquake', 'energy vortex', 'resurrection', 'summon air elemental', 'summon daemon', 'summon earth elemental', 'summon fire elemental', 'summon water elemental',
  // Necromancy
  'animate dead', 'blood oath', 'corpse skin', 'curse weapon', 'evil omen', 'horrific beast', 'lich form',
  'mind rot', 'pain spike', 'strangle', 'summon familiar', 'vampiric embrace', 'vengeful spirit', 'wither', 'wraith form',
  // Chivalry
  'cleanse by fire', 'close wounds', 'consecrate weapon', 'divine fury', 'enemy of one', 'holy light',
  'noble sacrifice', 'remove curse', 'sacred journey',
  // Bushido
  'confidence', 'counter attack', 'evasion', 'lightning strike', 'momentum strike', 'perfection', 'whirlwind attack',
  // Ninjitsu
  'animal form', 'backstab', 'death strike', 'focus attack', 'ki attack', 'mirror image', 'shadow jump', 'surprise attack',
  // Spellweaving
  'arcane circle', 'gift of renewal', 'immolating weapon', 'attune weapon', 'thunderstorm',
  "nature's fury", 'reaper form', 'wildfire', 'essence of wind', 'dryad allure', 'ethereal voyage',
  'word of death', 'gift of life', 'arcane empowerment',
];

// ---------------------------------------------------------------------------
// Skill Names
// ---------------------------------------------------------------------------
export const SKILL_NAMES: string[] = [
  'alchemy', 'anatomy', 'animal lore', 'item identification', 'arms lore', 'parrying', 'begging',
  'blacksmithing', 'bowcraft', 'peacemaking', 'camping', 'carpentry', 'cartography', 'cooking',
  'detecting hidden', 'discordance', 'evaluating intelligence', 'healing', 'fishing',
  'forensic evaluation', 'herding', 'hiding', 'provocation', 'inscription', 'lockpicking',
  'magery', 'magic resistance', 'tactics', 'snooping', 'musicianship', 'poisoning',
  'archery', 'spirit speak', 'stealing', 'tailoring', 'animal taming', 'taste identification',
  'tinkering', 'tracking', 'veterinary', 'swordsmanship', 'mace fighting', 'fencing',
  'wrestling', 'lumberjacking', 'mining', 'meditation', 'stealth', 'remove trap', 'necromancy',
  'focus', 'chivalry', 'bushido', 'ninjitsu', 'spellweaving', 'mysticism', 'imbuing', 'throwing',
  // Shorthand names used in scripts
  'anatomy', 'animallore', 'itemidentification', 'itemid', 'armslore', 'peace', 'cartography',
  'detectinghidden', 'discord', 'evalint', 'forensiceval', 'provo', 'meditation', 'stealth',
  'removetrap', 'imbuing', 'tasteid',
];

// ---------------------------------------------------------------------------
// Direction Names
// ---------------------------------------------------------------------------
export const DIRECTION_NAMES: string[] = [
  'North', 'South', 'East', 'West', 'Up', 'Down', 'Left', 'Right',
];

// ---------------------------------------------------------------------------
// Potion Types
// ---------------------------------------------------------------------------
export const POTION_TYPES: string[] = [
  'heal', 'cure', 'refresh', 'nightsight', 'ns', 'explosion', 'strength', 'str', 'agility',
];

// ---------------------------------------------------------------------------
// Virtue Types
// ---------------------------------------------------------------------------
export const VIRTUE_TYPES: string[] = ['honor', 'sacrifice', 'valor'];

// ---------------------------------------------------------------------------
// Ability Types
// ---------------------------------------------------------------------------
export const ABILITY_TYPES: string[] = ['primary', 'secondary', 'stun', 'disarm'];

// ---------------------------------------------------------------------------
// Target Types
// ---------------------------------------------------------------------------
export const TARGET_TYPES: string[] = [
  'closest', 'random', 'next', 'prev',
  'nonfriendly', 'friendly', 'enemy', 'red', 'murderer', 'gray', 'grey',
  'criminal', 'blue', 'innocent', 'friend', 'humanoid', 'monster',
  'clear', 'cancel',
];

// ---------------------------------------------------------------------------
// Layer Names
// ---------------------------------------------------------------------------
export const LAYER_NAMES: string[] = [
  'righthand', 'lefthand', 'shoes', 'pants', 'shirt', 'head', 'gloves', 'ring',
  'talisman', 'neck', 'hair', 'waist', 'innertorso', 'bracelet', 'face',
  'facialhair', 'middletorso', 'earrings', 'arms', 'cloak', 'backpack',
  'outertorso', 'outerlegs', 'innerlegs', 'onehandedsecondary', 'quiver', 'outerbody',
];

// ---------------------------------------------------------------------------
// Notoriety Types (Outlands)
// ---------------------------------------------------------------------------
export const NOTORIETY_TYPES: string[] = [
  'innocent', 'friend', 'hostile', 'criminal', 'enemy', 'murderer', 'invulnerable',
];

// ---------------------------------------------------------------------------
// Setskill Lock Values (Outlands)
// ---------------------------------------------------------------------------
export const SETSKILL_VALUES: string[] = ['up', 'down', 'lock'];

// ---------------------------------------------------------------------------
// Completion Items
// ---------------------------------------------------------------------------
function makeDoc(entry: DocEntry): { kind: typeof MarkupKind.Markdown; value: string } {
  let value = entry.description;
  if (entry.example) {
    value += `\n\n**Example:**\n\`\`\`\n${entry.example}\n\`\`\``;
  }
  return { kind: MarkupKind.Markdown, value };
}

function makeItem(
  label: string,
  kind: CompletionItemKind,
  insertText?: string,
  insertTextFormat?: InsertTextFormat
): CompletionItem {
  const entry = HOVER_MAP.get(label.toLowerCase());
  const item: CompletionItem = {
    label,
    kind,
    data: label,
  };
  if (insertText !== undefined) {
    item.insertText = insertText;
    item.insertTextFormat = insertTextFormat ?? InsertTextFormat.PlainText;
  }
  if (entry) {
    item.detail = entry.syntax;
    item.documentation = makeDoc(entry);
  }
  return item;
}

// ─── Command Completions ───────────────────────────────────────────────────
export const COMMAND_COMPLETIONS: CompletionItem[] = [
  // Action
  makeItem('attack',        CompletionItemKind.Function, "attack '${1:serial}'",              InsertTextFormat.Snippet),
  makeItem('cast',          CompletionItemKind.Function, "cast '${1:spell name}'",            InsertTextFormat.Snippet),
  makeItem('classicuo',     CompletionItemKind.Function, "classicuo '${1:setting}' '${2:value}'", InsertTextFormat.Snippet),
  makeItem('cuo',           CompletionItemKind.Function, "cuo '${1:setting}' '${2:value}'",   InsertTextFormat.Snippet),
  makeItem('cleardragdrop', CompletionItemKind.Function),
  makeItem('clearhands',    CompletionItemKind.Function, "clearhands '${1|left,right,both|}'", InsertTextFormat.Snippet),
  makeItem('cooldown',      CompletionItemKind.Function, "cooldown '${1:name}' ${2:30000}",    InsertTextFormat.Snippet),
  makeItem('dclick',        CompletionItemKind.Function, "dclick '${1:serial}'",              InsertTextFormat.Snippet),
  makeItem('dclicktype',    CompletionItemKind.Function, "dclicktype '${1:item name}'",       InsertTextFormat.Snippet),
  makeItem('dress',         CompletionItemKind.Function, "dress '${1:dress list name}'",      InsertTextFormat.Snippet),
  makeItem('drop',          CompletionItemKind.Function, "drop '${1:serial}' ${2:layer}",     InsertTextFormat.Snippet),
  makeItem('droprelloc',    CompletionItemKind.Function, 'droprelloc ${1:1} ${2:1}',          InsertTextFormat.Snippet),
  makeItem('getlabel',      CompletionItemKind.Function, "getlabel '${1:serial}' '${2:var}'", InsertTextFormat.Snippet),
  makeItem('hotkey',        CompletionItemKind.Function, "hotkey '${1:hotkey name}'",         InsertTextFormat.Snippet),
  makeItem('interrupt',     CompletionItemKind.Function),
  makeItem('lift',          CompletionItemKind.Function, "lift '${1:serial}'",                InsertTextFormat.Snippet),
  makeItem('lifttype',      CompletionItemKind.Function, "lifttype '${1:item name}'",         InsertTextFormat.Snippet),
  makeItem('music',         CompletionItemKind.Function, 'music ${1:11}',                     InsertTextFormat.Snippet),
  makeItem('potion',        CompletionItemKind.Function, "potion '${1|heal,cure,refresh,nightsight,explosion,strength,agility|}'", InsertTextFormat.Snippet),
  makeItem('rename',        CompletionItemKind.Function, "rename '${1:serial}' '${2:name}'",  InsertTextFormat.Snippet),
  makeItem('random',        CompletionItemKind.Function, 'random ${1:100}',                   InsertTextFormat.Snippet),
  makeItem('script',        CompletionItemKind.Function, "script '${1:script name}'",         InsertTextFormat.Snippet),
  makeItem('setability',    CompletionItemKind.Function, "setability '${1|primary,secondary,stun,disarm|}'", InsertTextFormat.Snippet),
  makeItem('setvar',        CompletionItemKind.Function, "setvar '${1:variable name}'",       InsertTextFormat.Snippet),
  makeItem('setvariable',   CompletionItemKind.Function, "setvariable '${1:variable name}'",  InsertTextFormat.Snippet),
  makeItem('skill',         CompletionItemKind.Function, "skill '${1:skill name}'",           InsertTextFormat.Snippet),
  makeItem('sound',         CompletionItemKind.Function, "sound '${1:serial}'",               InsertTextFormat.Snippet),
  makeItem('unsetvar',      CompletionItemKind.Function, "unsetvar '${1:variable name}'",     InsertTextFormat.Snippet),
  makeItem('virtue',        CompletionItemKind.Function, "virtue '${1|honor,sacrifice,valor|}'", InsertTextFormat.Snippet),
  makeItem('walk',          CompletionItemKind.Function, "walk '${1|North,South,East,West,Up,Down,Left,Right|}'", InsertTextFormat.Snippet),
  makeItem('wait',          CompletionItemKind.Function, 'wait ${1:1000}',                    InsertTextFormat.Snippet),
  makeItem('pause',         CompletionItemKind.Function, 'pause ${1:1000}',                   InsertTextFormat.Snippet),
  makeItem('undress',       CompletionItemKind.Function),

  // Agent
  makeItem('organizer',     CompletionItemKind.Function, 'organizer ${1:1}',                  InsertTextFormat.Snippet),
  makeItem('restock',       CompletionItemKind.Function, 'restock ${1:1}',                    InsertTextFormat.Snippet),
  makeItem('scavenger',     CompletionItemKind.Function, "scavenger '${1|clear,add,on,off,set|}'", InsertTextFormat.Snippet),
  makeItem('sell',          CompletionItemKind.Function),
  makeItem('useonce',       CompletionItemKind.Function),

  // Gumps
  makeItem('gumpresponse',  CompletionItemKind.Function, 'gumpresponse ${1:4}',               InsertTextFormat.Snippet),
  makeItem('gumpclose',     CompletionItemKind.Function),
  makeItem('menu',          CompletionItemKind.Function, 'menu ${1:0} ${2:0}',                InsertTextFormat.Snippet),
  makeItem('menuresponse',  CompletionItemKind.Function, 'menuresponse ${1:3} ${2:4}',        InsertTextFormat.Snippet),
  makeItem('promptresponse',CompletionItemKind.Function, "promptresponse '${1:response}'",    InsertTextFormat.Snippet),
  makeItem('waitforgump',   CompletionItemKind.Function, "waitforgump 'any'",                 InsertTextFormat.Snippet),
  makeItem('waitformenu',   CompletionItemKind.Function, "waitformenu 'any'",                 InsertTextFormat.Snippet),
  makeItem('waitforprompt', CompletionItemKind.Function, "waitforprompt 'any'",               InsertTextFormat.Snippet),

  // Ignore
  makeItem('clearignore',   CompletionItemKind.Function),
  makeItem('ignore',        CompletionItemKind.Function, "ignore '${1:serial}'",              InsertTextFormat.Snippet),
  makeItem('unignore',      CompletionItemKind.Function, "unignore '${1:serial}'",            InsertTextFormat.Snippet),

  // List
  makeItem('clearlist',     CompletionItemKind.Function, "clearlist '${1:list name}'",        InsertTextFormat.Snippet),
  makeItem('createlist',    CompletionItemKind.Function, "createlist '${1:list name}'",       InsertTextFormat.Snippet),
  makeItem('poplist',       CompletionItemKind.Function, "poplist '${1:list name}' '${2|front,back|}'", InsertTextFormat.Snippet),
  makeItem('pushlist',      CompletionItemKind.Function, "pushlist '${1:list name}' '${2:item}'", InsertTextFormat.Snippet),
  makeItem('removelist',    CompletionItemKind.Function, "removelist '${1:list name}'",       InsertTextFormat.Snippet),

  // Messaging
  makeItem('alliance',      CompletionItemKind.Function, "alliance '${1:message}'",           InsertTextFormat.Snippet),
  makeItem('clearsysmsg',   CompletionItemKind.Function),
  makeItem('emote',         CompletionItemKind.Function, "emote '${1:message}'",              InsertTextFormat.Snippet),
  makeItem('guild',         CompletionItemKind.Function, "guild '${1:message}'",              InsertTextFormat.Snippet),
  makeItem('overhead',      CompletionItemKind.Function, "overhead '${1:message}'",           InsertTextFormat.Snippet),
  makeItem('say',           CompletionItemKind.Function, "say '${1:message}'",                InsertTextFormat.Snippet),
  makeItem('msg',           CompletionItemKind.Function, "msg '${1:message}'",                InsertTextFormat.Snippet),
  makeItem('sysmsg',        CompletionItemKind.Function, "sysmsg '${1:message}'",             InsertTextFormat.Snippet),
  makeItem('waitforsysmsg', CompletionItemKind.Function, "waitforsysmsg '${1:message}'",      InsertTextFormat.Snippet),
  makeItem('wfsysmsg',      CompletionItemKind.Function, "wfsysmsg '${1:message}'",           InsertTextFormat.Snippet),
  makeItem('whisper',       CompletionItemKind.Function, "whisper '${1:message}'",            InsertTextFormat.Snippet),
  makeItem('yell',          CompletionItemKind.Function, "yell '${1:message}'",               InsertTextFormat.Snippet),

  // Targeting
  makeItem('clearall',      CompletionItemKind.Function),
  makeItem('lasttarget',    CompletionItemKind.Function),
  makeItem('setlasttarget', CompletionItemKind.Function, "setlasttarget '${1:serial}'",       InsertTextFormat.Snippet),
  makeItem('target',        CompletionItemKind.Function, "target '${1|closest,random,next,prev,self,last|}'", InsertTextFormat.Snippet),
  makeItem('targetrelloc',  CompletionItemKind.Function, 'targetrelloc ${1:1} ${2:1}',        InsertTextFormat.Snippet),
  makeItem('targetloc',     CompletionItemKind.Function, 'targetloc ${1:5000} ${2:1000} ${3:0}', InsertTextFormat.Snippet),
  makeItem('targettype',    CompletionItemKind.Function, "targettype '${1:item name}'",       InsertTextFormat.Snippet),
  makeItem('waitfortarget', CompletionItemKind.Function),
  makeItem('wft',           CompletionItemKind.Function),

  // Timers
  makeItem('createtimer',   CompletionItemKind.Function, "createtimer '${1:timer name}'",     InsertTextFormat.Snippet),
  makeItem('removetimer',   CompletionItemKind.Function, "removetimer '${1:timer name}'",     InsertTextFormat.Snippet),
  makeItem('settimer',      CompletionItemKind.Function, "settimer '${1:timer name}' ${2:0}", InsertTextFormat.Snippet),

  // Outlands
  makeItem('findtypelist', CompletionItemKind.Function, "findtypelist '${1:list}' '${2:item name}'",        InsertTextFormat.Snippet),
  makeItem('setskill',     CompletionItemKind.Function, "setskill '${1:skill name}' '${2|up,down,lock|}'",  InsertTextFormat.Snippet),
  makeItem('warmode',      CompletionItemKind.Function, "warmode '${1|on,off|}'",                           InsertTextFormat.Snippet),
];

// ─── Control Flow Snippet Completions ─────────────────────────────────────
export const CONTROL_FLOW_COMPLETIONS: CompletionItem[] = [
  {
    label: 'if',
    kind: CompletionItemKind.Keyword,
    detail: 'if (expression) ... endif',
    insertText: 'if ${1:condition}\n\t$0\nendif',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: makeDoc(HOVER_MAP.get('if')!),
  },
  {
    label: 'if not',
    kind: CompletionItemKind.Keyword,
    detail: 'if not (expression) ... endif',
    insertText: 'if not ${1:condition}\n\t$0\nendif',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: { kind: MarkupKind.Markdown, value: 'Execute commands if the expression is **false**.' },
  },
  makeItem('elseif', CompletionItemKind.Keyword, 'elseif ${1:condition}', InsertTextFormat.Snippet),
  makeItem('else',   CompletionItemKind.Keyword),
  makeItem('endif',  CompletionItemKind.Keyword),
  {
    label: 'while',
    kind: CompletionItemKind.Keyword,
    detail: 'while (expression) ... endwhile',
    insertText: 'while ${1:condition}\n\t$0\nendwhile',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: makeDoc(HOVER_MAP.get('while')!),
  },
  makeItem('endwhile', CompletionItemKind.Keyword),
  {
    label: 'for',
    kind: CompletionItemKind.Keyword,
    detail: 'for (number) ... endfor',
    insertText: 'for ${1:10}\n\t$0\nendfor',
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: makeDoc(HOVER_MAP.get('for')!),
  },
  {
    label: 'foreach',
    kind: CompletionItemKind.Keyword,
    detail: "foreach ('var') in ('list') ... endfor",
    insertText: "foreach '${1:item}' in '${2:list}'\n\t$0\nendfor",
    insertTextFormat: InsertTextFormat.Snippet,
    documentation: makeDoc(HOVER_MAP.get('foreach')!),
  },
  makeItem('endfor',   CompletionItemKind.Keyword),
  makeItem('break',    CompletionItemKind.Keyword),
  makeItem('continue', CompletionItemKind.Keyword),
  makeItem('stop',     CompletionItemKind.Keyword),
  makeItem('loop',     CompletionItemKind.Keyword),
  makeItem('replay',   CompletionItemKind.Keyword),
];

// ─── Expression Completions ────────────────────────────────────────────────
export const EXPRESSION_COMPLETIONS: CompletionItem[] = [
  // Player attributes
  makeItem('hp',           CompletionItemKind.Value),
  makeItem('hits',         CompletionItemKind.Value),
  makeItem('maxhp',        CompletionItemKind.Value),
  makeItem('maxhits',      CompletionItemKind.Value),
  makeItem('mana',         CompletionItemKind.Value),
  makeItem('maxmana',      CompletionItemKind.Value),
  makeItem('stam',         CompletionItemKind.Value),
  makeItem('maxstam',      CompletionItemKind.Value),
  makeItem('str',          CompletionItemKind.Value),
  makeItem('dex',          CompletionItemKind.Value),
  makeItem('int',          CompletionItemKind.Value),
  makeItem('weight',       CompletionItemKind.Value),
  makeItem('maxweight',    CompletionItemKind.Value),
  makeItem('followers',    CompletionItemKind.Value),
  makeItem('maxfollowers', CompletionItemKind.Value),
  makeItem('diffhits',     CompletionItemKind.Value),
  makeItem('diffhp',       CompletionItemKind.Value),
  makeItem('diffmana',     CompletionItemKind.Value),
  makeItem('diffstam',     CompletionItemKind.Value),
  makeItem('diffweight',   CompletionItemKind.Value),
  makeItem('hidden',       CompletionItemKind.Value),
  makeItem('mounted',      CompletionItemKind.Value),
  makeItem('paralyzed',    CompletionItemKind.Value),
  makeItem('poisoned',     CompletionItemKind.Value),
  makeItem('warmode',      CompletionItemKind.Value),
  makeItem('invuln',       CompletionItemKind.Value),
  makeItem('invul',        CompletionItemKind.Value),
  makeItem('blessed',      CompletionItemKind.Value),
  makeItem('lhandempty',   CompletionItemKind.Value),
  makeItem('rhandempty',   CompletionItemKind.Value),
  makeItem('name',         CompletionItemKind.Value),
  makeItem('itemcount',    CompletionItemKind.Value),
  makeItem('queued',       CompletionItemKind.Value),
  // Expressions with arguments
  makeItem('skill',        CompletionItemKind.Value, "skill '${1:skill name}'",         InsertTextFormat.Snippet),
  makeItem('position',     CompletionItemKind.Value, 'position ${1:x} ${2:y}',          InsertTextFormat.Snippet),
  makeItem('count',        CompletionItemKind.Value, "count '${1:item name}'",           InsertTextFormat.Snippet),
  makeItem('counter',      CompletionItemKind.Value, "counter '${1:name}'",              InsertTextFormat.Snippet),
  makeItem('findtype',     CompletionItemKind.Value, "findtype '${1:item name}'",        InsertTextFormat.Snippet),
  makeItem('insysmsg',     CompletionItemKind.Value, "insysmsg '${1:message}'",          InsertTextFormat.Snippet),
  makeItem('insysmessage', CompletionItemKind.Value, "insysmessage '${1:message}'",      InsertTextFormat.Snippet),
  makeItem('targetexists', CompletionItemKind.Value, "targetexists '${1|any,beneficial,harmful,neutral|}'", InsertTextFormat.Snippet),
  makeItem('varexist',     CompletionItemKind.Value, "varexist '${1:variable}'",         InsertTextFormat.Snippet),
  makeItem('varexists',    CompletionItemKind.Value, "varexists '${1:variable}'",        InsertTextFormat.Snippet),
  makeItem('findbuff',     CompletionItemKind.Value, "findbuff '${1:buff name}'",        InsertTextFormat.Snippet),
  makeItem('inlist',       CompletionItemKind.Value, "inlist '${1:list}' '${2:item}'",   InsertTextFormat.Snippet),
  makeItem('list',         CompletionItemKind.Value, "list '${1:list name}'",            InsertTextFormat.Snippet),
  makeItem('listexists',   CompletionItemKind.Value, "listexists '${1:list name}'",      InsertTextFormat.Snippet),
  makeItem('timer',        CompletionItemKind.Value, "timer '${1:name}'",                InsertTextFormat.Snippet),
  makeItem('timerexists',  CompletionItemKind.Value, "timerexists '${1:name}'",          InsertTextFormat.Snippet),
  makeItem('timerexist',   CompletionItemKind.Value, "timerexist '${1:name}'",           InsertTextFormat.Snippet),
  makeItem('poplist',      CompletionItemKind.Value, "poplist '${1:list}' '${2|front,back|}' as '${3:item}'", InsertTextFormat.Snippet),

  // ─── Outlands Expressions ────────────────────────────────────────────────
  makeItem('find',         CompletionItemKind.Value, "find '${1:serial}'",                              InsertTextFormat.Snippet),
  makeItem('findlayer',    CompletionItemKind.Value, 'findlayer ${1:self} ${2|righthand,lefthand,gloves,head,ring,neck,shirt,pants,shoes,innertorso,bracelet,arms,cloak,outertorso,outerlegs,innerlegs,hair,waist,backpack,talisman,earrings,face,facialhair,middletorso,onehandedsecondary,quiver,outerbody|}', InsertTextFormat.Snippet),
  makeItem('noto',         CompletionItemKind.Value, 'noto ${1:lastObject} = ${2|innocent,friend,hostile,criminal,enemy,murderer,invulnerable|}', InsertTextFormat.Snippet),
  makeItem('dead',         CompletionItemKind.Value, 'dead ${1:serial}',                                InsertTextFormat.Snippet),
  makeItem('hue',          CompletionItemKind.Value, 'hue ${1:serial}',                                 InsertTextFormat.Snippet),
  makeItem('counttype',    CompletionItemKind.Value, "counttype '${1:item name}'",                      InsertTextFormat.Snippet),
  makeItem('gumpexists',   CompletionItemKind.Value, "gumpexists '${1|any|}'",                          InsertTextFormat.Snippet),
  makeItem('ingump',       CompletionItemKind.Value, "ingump '${1:text}'",                              InsertTextFormat.Snippet),
  makeItem('bandaging',    CompletionItemKind.Value),
  makeItem('pvp',          CompletionItemKind.Value),
  makeItem('casting',      CompletionItemKind.Value),
  makeItem('atlist',       CompletionItemKind.Value, "atlist '${1:list}' ${2:0} as '${3:item}'",        InsertTextFormat.Snippet),
  makeItem('finddebuff',   CompletionItemKind.Value, "finddebuff '${1:debuff name}'",                   InsertTextFormat.Snippet),
  makeItem('findtypelist', CompletionItemKind.Value, "findtypelist '${1:list}' '${2:item name}'",       InsertTextFormat.Snippet),
  makeItem('cooldown',     CompletionItemKind.Value, "cooldown '${1:name}'",                            InsertTextFormat.Snippet),
];

// ─── Logical Keyword Completions ──────────────────────────────────────────
export const LOGICAL_COMPLETIONS: CompletionItem[] = [
  makeItem('and', CompletionItemKind.Operator),
  makeItem('or',  CompletionItemKind.Operator),
  makeItem('not', CompletionItemKind.Operator),
  makeItem('as',  CompletionItemKind.Keyword),
  makeItem('in',  CompletionItemKind.Keyword),
];

// ─── Pre-defined Variable Completions ─────────────────────────────────────
export const VARIABLE_COMPLETIONS: CompletionItem[] = [
  makeItem('self',       CompletionItemKind.Variable),
  makeItem('backpack',   CompletionItemKind.Variable),
  makeItem('hands',      CompletionItemKind.Variable),
  makeItem('index',      CompletionItemKind.Variable),
  makeItem('lasttarget', CompletionItemKind.Variable),
  makeItem('last',       CompletionItemKind.Variable),
  makeItem('lastobject', CompletionItemKind.Variable),
  makeItem('lefthand',   CompletionItemKind.Variable),
  makeItem('righthand',  CompletionItemKind.Variable),
  makeItem('ground',     CompletionItemKind.Variable),
];

/** Build a completion item list from string values (e.g., spell names). */
export function buildStringCompletions(
  values: string[],
  kind: CompletionItemKind = CompletionItemKind.Value
): CompletionItem[] {
  return values.map((v) => ({ label: v, kind, insertText: v }));
}
