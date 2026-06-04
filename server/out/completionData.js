"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VARIABLE_COMPLETIONS = exports.LOGICAL_COMPLETIONS = exports.EXPRESSION_COMPLETIONS = exports.CONTROL_FLOW_COMPLETIONS = exports.COMMAND_COMPLETIONS = exports.SETSKILL_VALUES = exports.NOTORIETY_TYPES = exports.LAYER_NAMES = exports.TARGET_TYPES = exports.ABILITY_TYPES = exports.VIRTUE_TYPES = exports.POTION_TYPES = exports.DIRECTION_NAMES = exports.SKILL_NAMES = exports.SPELL_NAMES = exports.HOVER_MAP = void 0;
exports.buildStringCompletions = buildStringCompletions;
const node_1 = require("vscode-languageserver/node");
// ---------------------------------------------------------------------------
// Hover / documentation map
// ---------------------------------------------------------------------------
exports.HOVER_MAP = new Map([
    // ─── Action Commands ────────────────────────────────────────────────────
    ['attack', { syntax: 'attack (serial)', description: 'Attack a specific serial or variable tied to a serial.' }],
    ['cast', { syntax: "cast ('name of spell')", description: 'Cast a spell by name.', example: "cast 'greater heal'\nwft\ntarget 'self'" }],
    ['classicuo', { syntax: "classicuo ('setting') ('value')", description: 'Change a setting in your current ClassicUO profile. Use `>cuo list` to get a list of settings.' }],
    ['cuo', { syntax: "cuo ('setting') ('value')", description: 'Alias for classicuo. Change a setting in your current ClassicUO profile.' }],
    ['cleardragdrop', { syntax: 'cleardragdrop', description: "Clears Razor's drag/drop queue." }],
    ['clearhands', { syntax: "clearhands ('left'/'right'/'both')", description: 'Undress your hands based on the parameter.' }],
    ['cooldown', { syntax: "cooldown ('name') [milliseconds]", description: 'Trigger a named cooldown. As expression: check if cooldown is active or compare remaining time in ms.', example: "cooldown 'mycd' 30000\nif cooldown 'mycd' > 5000\n    overhead 'Still cooling down...'\nendif" }],
    ['dclick', { syntax: "dclick (serial) or dclick ('left'/'right'/'hands')", description: "Double-click a specific item or mobile, or use the item in one of your hands." }],
    ['dclicktype', { syntax: "dclicktype ('name'/'graphicId') [src] [hue] [qty] [range]", description: "Double-click an item type by name or graphic ID. Source can be a serial, 'self', 'backpack', or 'ground'.", example: "dclicktype 'dagger'\nwaitfortarget\ntargettype 'robe'" }],
    ['dress', { syntax: "dress ('name of dress list') or dress (serial)", description: 'Execute a saved dress list or dress a specific serial.' }],
    ['drop', { syntax: 'drop (serial) (x) (y) [z] or drop (serial) (layer)', description: 'Drop the item you are holding at a location or on a specific layer.', example: "lift '0x400D54A7'\ndrop 'self' InnerTorso" }],
    ['droprelloc', { syntax: 'droprelloc (x) (y)', description: "Drop the item you're holding at a location relative to your position." }],
    ['getlabel', { syntax: "getlabel ('serial') ('variable name')", description: "Get the label (single-click text) of an item or mobile and save it to a variable." }],
    ['hotkey', { syntax: "hotkey ('name of hotkey')", description: 'Execute any Razor hotkey by name.' }],
    ['interrupt', { syntax: "interrupt ['layer']", description: 'Interrupt a casting action. Optionally specify a layer.' }],
    ['lift', { syntax: "lift ('serial') ['amount'] ['timeout']", description: 'Lift a specific item and amount. Default amount: 1. Default timeout: 30000ms.' }],
    ['lifttype', { syntax: "lifttype ('gfx'/'name') [amount] [src] [hue]", description: "Lift an item type by graphic ID or name. Source limited to 'backpack', 'self', or 'ground'." }],
    ['music', { syntax: "music ('index')", description: 'Play music based on the ID from Music/Digital/Config.txt.' }],
    ['potion', { syntax: "potion ('heal'/'cure'/'refresh'/'nightsight'/'ns'/'explosion'/'strength'/'str'/'agility')", description: 'Use a specific potion by type.' }],
    ['rename', { syntax: "rename (serial) ('name')", description: 'Attempt to rename a mobile.' }],
    ['random', { syntax: "random ('max number')", description: 'Generate a random number between 1 and max. Result is placed in system message queue.' }],
    ['script', { syntax: "script ('name') or script ('category\\\\name')", description: 'Call another script. Supports category paths using backslash.' }],
    ['setability', { syntax: "setability ('primary'/'secondary'/'stun'/'disarm') ['on'/'off']", description: "Set a specific special move ability on or off. Default: 'on'." }],
    ['setvar', { syntax: "setvar ('variable') ['serial'] ['timeout']", description: 'Pause the script until a target is selected and assign it to a variable. Use `setvar!` for temp variables.' }],
    ['setvariable', { syntax: "setvariable ('variable') ['serial'] ['timeout']", description: 'Alias for setvar.' }],
    ['skill', { syntax: "skill ('name of skill') or skill last", description: 'Use a specific skill by name.', example: "skill 'meditation'\nwait 11000" }],
    ['sound', { syntax: "sound ('serial')", description: 'Play a specific sound by serial ID.' }],
    ['unsetvar', { syntax: "unsetvar ('variable')", description: 'Remove a variable from the variable list. Use `unsetvar!` for temp variables.' }],
    ['virtue', { syntax: "virtue ('honor'/'sacrifice'/'valor')", description: 'Invoke Honor, Sacrifice or Valor.' }],
    ['walk', { syntax: "walk ('North'/'South'/'East'/'West'/'Up'/'Down'/'Left'/'Right')", description: 'Turn and/or walk your player in a direction.' }],
    ['wait', { syntax: 'wait (milliseconds) or wait (duration) (s/m)', description: 'Pause script execution. 1000ms = 1 second. Shorthand: s (seconds), m (minutes).', example: 'wait 5000\nwait 5 s\nwait 1 m' }],
    ['pause', { syntax: 'pause (milliseconds)', description: 'Alias for wait. Pause script execution.' }],
    ['undress', { syntax: "undress ['name'/'LayerName'/serial]", description: 'Undress entirely, or undress by dress list name, layer, or serial.' }],
    // ─── Agent Commands ──────────────────────────────────────────────────────
    ['organizer', { syntax: "organizer ('number') ['set']", description: "Execute a specific organizer agent. Include 'set' to set the agent's hotbag." }],
    ['restock', { syntax: "restock ('number') ['set']", description: "Execute a specific restock agent. Include 'set' to set the agent's hotbag." }],
    ['scavenger', { syntax: "scavenger ('clear'/'add'/'on'/'off'/'set')", description: 'Control the scavenger agent. Actions: clear, add, on, off, set.' }],
    ['sell', { syntax: 'sell', description: "Set the Sell agent's hotbag." }],
    ['useonce', { syntax: "useonce ['add'/'addcontainer']", description: 'Execute the UseOnce agent. Use add/addcontainer to populate the list.' }],
    // ─── Gumps / Menus / Prompts ─────────────────────────────────────────────
    ['gumpresponse', { syntax: "gumpresponse ('buttonID')", description: 'Respond to a specific gump button by ID.' }],
    ['gumpclose', { syntax: "gumpclose ['gumpID']", description: 'Close the last gump, or a specific gump by ID.' }],
    ['menu', { syntax: "menu (serial) (index) ['false']", description: 'Select a context menu item by index. Pass false to prevent Razor from blocking the menu.' }],
    ['menuresponse', { syntax: "menuresponse ('index') ('menuId') ['hue']", description: 'Respond to a specific menu and menu ID. Not for context menus — use menu instead.' }],
    ['promptresponse', { syntax: "promptresponse ('prompt response')", description: 'Respond to a prompt (e.g., renaming runes).', example: "dclicktype 'rune'\nwaitforprompt\npromptresponse 'to home'" }],
    ['waitforgump', { syntax: "waitforgump (gumpId/'any') [timeout]", description: "Wait for a gump. Default timeout: 30s. Use 'any' to wait for any gump." }],
    ['waitformenu', { syntax: "waitformenu (menuId/'any') [timeout]", description: "Wait for a menu. Default timeout: 30s. Use 'any' for any menu." }],
    ['waitforprompt', { syntax: "waitforprompt (promptId/'any') [timeout]", description: "Wait for a prompt. Default timeout: 30s. Use 'any' for any prompt." }],
    // ─── Ignore Commands ─────────────────────────────────────────────────────
    ['clearignore', { syntax: 'clearignore', description: 'Clear the scripting ignore list.' }],
    ['ignore', { syntax: "ignore ('serial'/'list name')", description: 'Add a serial or list to the ignore list (used with findtype).' }],
    ['unignore', { syntax: "unignore ('serial'/'list name')", description: 'Remove a serial or list from the ignore list.' }],
    // ─── List Commands ───────────────────────────────────────────────────────
    ['clearlist', { syntax: "clearlist ('list name')", description: 'Clear all items from a list without removing the list itself.' }],
    ['createlist', { syntax: "createlist ('list name')", description: 'Create an empty named list.' }],
    ['poplist', { syntax: "poplist ('list name') ('value'/'front'/'back')", description: "Remove an item from a list. Use 'front' or 'back' to remove by position." }],
    ['pushlist', { syntax: "pushlist ('list name') ('item') ['front'/'back']", description: "Add an item to a list. Default appends to the end. Use 'front'/'back' to specify position." }],
    ['removelist', { syntax: "removelist ('list name')", description: 'Completely remove a list and all its items.' }],
    // ─── Messaging Commands ──────────────────────────────────────────────────
    ['alliance', { syntax: "alliance ('message')", description: 'Say a message on the alliance channel.' }],
    ['clearsysmsg', { syntax: 'clearsysmsg', description: "Clear Razor's internal system message queue." }],
    ['emote', { syntax: "emote ('message') [hue]", description: 'Emote a message. Razor wraps it in * characters.' }],
    ['guild', { syntax: "guild ('message')", description: 'Say a message on the guild channel.' }],
    ['overhead', { syntax: "overhead ('text') ['color'] ['serial']", description: 'Display text over your head. Only visible to you. Variable names are evaluated.' }],
    ['say', { syntax: "say ('message') [hue]", description: 'Say a message in public chat.' }],
    ['msg', { syntax: "msg ('message') [hue]", description: 'Alias for say.' }],
    ['sysmsg', { syntax: "sysmsg ('message')", description: 'Display a message in the lower-left system message area.' }],
    ['waitforsysmsg', { syntax: "waitforsysmsg ('message') [timeout]", description: 'Wait for a specific system message. Default timeout: 30s.' }],
    ['wfsysmsg', { syntax: "wfsysmsg ('message') [timeout]", description: 'Alias for waitforsysmsg.' }],
    ['whisper', { syntax: "whisper ('message') [hue]", description: 'Whisper a message.' }],
    ['yell', { syntax: "yell ('message') [hue]", description: 'Yell a message.' }],
    // ─── Targeting Commands ──────────────────────────────────────────────────
    ['clearall', { syntax: 'clearall', description: 'Cancel current target, clear target queue, drop held item, and clear drag/drop queue.' }],
    ['lasttarget', { syntax: 'lasttarget', description: "Target your last target set in Razor.", example: "cast 'magic arrow'\nwaitfortarget\nlasttarget" }],
    ['setlasttarget', { syntax: "setlasttarget ('serial')", description: 'Set the last target to a specific serial.' }],
    ['target', { syntax: "target ('closest'/'random'/'next'/'prev') [types] [humanoid/monster] or target (serial) or target (clear/cancel)", description: "Target a mobile. Types can be: nonfriendly, friendly, enemy, red, gray, criminal, blue, friend, humanoid, monster." }],
    ['targetrelloc', { syntax: 'targetrelloc (x-offset) (y-offset)', description: 'Target a location relative to your current position.' }],
    ['targetloc', { syntax: 'targetloc (x) (y) (z)', description: 'Target a specific map coordinate.' }],
    ['targettype', { syntax: "targettype ('name'/'graphicId') [src] [hue] [qty] [range]", description: "Target a specific item or mobile type. Source can be a serial, 'self', 'backpack', or 'ground'." }],
    ['waitfortarget', { syntax: 'waitfortarget [timeout]', description: "Wait for a target cursor. Default timeout: 30s.", example: "cast 'energy bolt'\nwaitfortarget\ntarget 'last'" }],
    ['wft', { syntax: 'wft [timeout]', description: 'Alias for waitfortarget.' }],
    // ─── Timer Commands ──────────────────────────────────────────────────────
    ['createtimer', { syntax: "createtimer ('name')", description: 'Create a timer that starts counting up from 0 immediately.' }],
    ['removetimer', { syntax: "removetimer ('name')", description: 'Remove and delete a specific timer.' }],
    ['settimer', { syntax: "settimer ('name') ('milliseconds')", description: 'Set a timer to a specific value (in ms) and start counting up.' }],
    // ─── Expressions ────────────────────────────────────────────────────────
    ['hp', { syntax: 'hp', description: 'Current hit points / health.' }],
    ['hits', { syntax: 'hits', description: 'Alias for hp. Current hit points.' }],
    ['maxhp', { syntax: 'maxhp', description: 'Maximum hit points.' }],
    ['maxhits', { syntax: 'maxhits', description: 'Alias for maxhp. Maximum hit points.' }],
    ['mana', { syntax: 'mana', description: 'Current mana.' }],
    ['maxmana', { syntax: 'maxmana', description: 'Maximum mana.' }],
    ['stam', { syntax: 'stam', description: 'Current stamina.' }],
    ['maxstam', { syntax: 'maxstam', description: 'Maximum stamina.' }],
    ['str', { syntax: 'str', description: 'Current strength stat.' }],
    ['dex', { syntax: 'dex', description: 'Current dexterity stat.' }],
    ['int', { syntax: 'int', description: 'Current intelligence stat.' }],
    ['weight', { syntax: 'weight', description: 'Current weight carried.' }],
    ['maxweight', { syntax: 'maxweight', description: 'Maximum weight allowed.' }],
    ['followers', { syntax: 'followers', description: 'Current number of followers.' }],
    ['maxfollowers', { syntax: 'maxfollowers', description: 'Maximum number of followers allowed.' }],
    ['diffhits', { syntax: 'diffhits', description: 'Difference between max HP and current HP.' }],
    ['diffhp', { syntax: 'diffhp', description: 'Alias for diffhits.' }],
    ['diffmana', { syntax: 'diffmana', description: 'Difference between max mana and current mana.' }],
    ['diffstam', { syntax: 'diffstam', description: 'Difference between max stamina and current stamina.' }],
    ['diffweight', { syntax: 'diffweight', description: 'Difference between max weight and current weight.' }],
    ['hidden', { syntax: 'hidden', description: 'Returns true if your character is currently hidden.' }],
    ['mounted', { syntax: 'mounted', description: 'Returns true if your character is currently mounted.' }],
    ['paralyzed', { syntax: 'paralyzed', description: 'Returns true if your character is currently paralyzed.' }],
    ['poisoned', { syntax: 'poisoned', description: 'Returns true if your character is currently poisoned.' }],
    ['warmode', { syntax: "warmode or warmode ('on'/'off')", description: "As expression: returns true if in war/combat mode. As command (Outlands): explicitly set war mode state." }],
    ['invuln', { syntax: 'invuln', description: 'Returns true if your character is invulnerable (blessed).' }],
    ['invul', { syntax: 'invul', description: 'Alias for invuln.' }],
    ['blessed', { syntax: 'blessed', description: 'Alias for invuln. Returns true if invulnerable.' }],
    ['lhandempty', { syntax: 'lhandempty', description: 'Returns true if your left hand is empty.' }],
    ['rhandempty', { syntax: 'rhandempty', description: 'Returns true if your right hand is empty.' }],
    ['name', { syntax: 'name', description: "Returns the name of the currently logged-in character." }],
    ['position', { syntax: 'position (x, y) or position (x, y, z)', description: 'Returns true if your current position matches the provided coordinates.' }],
    ['count', { syntax: "count ('name'/'graphicId') [hue]", description: 'Count items of a specific type in your backpack.' }],
    ['counter', { syntax: "counter ('name')", description: 'Get the count of a named counter from the Counters tab.' }],
    ['findtype', { syntax: "findtype ('name'/'graphicId') [src] [hue] [qty] [range]", description: "Check if a specific item type exists. Source can be a serial, 'self', 'backpack', or 'ground'. Use 'as' to assign to a variable.", example: "if findtype 'dagger' backpack as 'my_dagger'\n    dclick 'my_dagger'\nendif" }],
    ['insysmsg', { syntax: "insysmsg ('text')", description: "Check if text appears in Razor's system message queue. Use `>sysmsgs` to see the queue." }],
    ['insysmessage', { syntax: "insysmessage ('text')", description: 'Alias for insysmsg.' }],
    ['itemcount', { syntax: 'itemcount', description: "Return the current number of items you're carrying." }],
    ['queued', { syntax: 'queued', description: 'Returns true if a queue is active (from restocking, organizing, etc.).' }],
    ['targetexists', { syntax: "targetexists ['any'/'beneficial'/'harmful'/'neutral']", description: 'Returns true if the client currently has a target cursor.' }],
    ['varexist', { syntax: "varexist ('name')", description: 'Returns true if a variable with the given name exists.' }],
    ['varexists', { syntax: "varexists ('name')", description: 'Alias for varexist.' }],
    ['findbuff', { syntax: "findbuff ('buff name')", description: 'Returns true if a specific buff or debuff is currently applied to you.' }],
    ['inlist', { syntax: "inlist ('list name') ('item')", description: 'Returns true if a specific item is in the named list.' }],
    ['list', { syntax: "list ('list name')", description: 'Returns the number of items in the named list.' }],
    ['listexists', { syntax: "listexists ('list name')", description: 'Returns true if a list with the given name exists.' }],
    ['timer', { syntax: "timer ('name')", description: 'Returns the elapsed time in milliseconds for the named timer.' }],
    ['timerexists', { syntax: "timerexists ('name')", description: 'Returns true if a timer with the given name exists.' }],
    ['timerexist', { syntax: "timerexist ('name')", description: 'Alias for timerexists.' }],
    // ─── Keywords ────────────────────────────────────────────────────────────
    ['if', { syntax: 'if (expression) ... endif', description: 'Execute commands only if the expression is true. Must end with endif.', example: 'if hp < 50\n    cast \'greater heal\'\n    wft\n    target \'self\'\nendif' }],
    ['elseif', { syntax: 'elseif (expression)', description: 'Alternative condition within an if block. Evaluated if the previous if/elseif was false.' }],
    ['else', { syntax: 'else', description: 'Default branch when all if/elseif conditions are false.' }],
    ['endif', { syntax: 'endif', description: 'Close an if/elseif/else block.' }],
    ['while', { syntax: 'while (expression) ... endwhile', description: 'Execute commands repeatedly while expression is true. Must end with endwhile.', example: 'while mana < maxmana\n    skill \'meditation\'\n    wait 11000\nendwhile' }],
    ['endwhile', { syntax: 'endwhile', description: 'Close a while loop.' }],
    ['for', { syntax: 'for (number) ... endfor', description: 'Execute commands a specific number of times. Use `index` variable to track iteration. Must end with endfor.' }],
    ['foreach', { syntax: "foreach ('var') in ('list') ... endfor", description: 'Iterate over all items in a list. Must end with endfor.' }],
    ['endfor', { syntax: 'endfor', description: 'Close a for or foreach loop.' }],
    ['break', { syntax: 'break', description: 'Exit the closest enclosing for or while loop immediately.' }],
    ['continue', { syntax: 'continue', description: 'Skip to the next iteration of the closest enclosing for or while loop.' }],
    ['stop', { syntax: 'stop', description: 'Stop execution of the current script.' }],
    ['loop', { syntax: 'loop', description: 'Restart the script from the beginning indefinitely.' }],
    ['replay', { syntax: 'replay', description: 'Alias for loop. Restart the script from the beginning.' }],
    ['and', { syntax: '(condition) and (condition)', description: 'Logical AND. Both conditions must be true.' }],
    ['or', { syntax: '(condition) or (condition)', description: 'Logical OR. At least one condition must be true.' }],
    ['not', { syntax: 'not (condition)', description: 'Logical NOT. Inverts the result of the condition.' }],
    ['as', { syntax: '(expression) as (variable)', description: "Assign the result of findtype to a variable. Used as: `findtype 'item' as 'myvar'`." }],
    ['in', { syntax: "(word) in (variable)", description: "Check if a word appears within a variable string. Used with getlabel." }],
    // ─── Pre-defined Variables ───────────────────────────────────────────────
    ['self', { syntax: 'self', description: 'The serial of your player character.' }],
    ['backpack', { syntax: 'backpack', description: "The serial of your character's backpack." }],
    ['hands', { syntax: 'hands', description: 'The serial of the item in either hand.' }],
    ['index', { syntax: 'index', description: 'The current loop iteration number (0-based). Available inside for/while loops.' }],
    ['lasttarget', { syntax: 'lasttarget', description: 'The serial of your current last target in Razor.' }],
    ['last', { syntax: 'last', description: 'Alias for lasttarget.' }],
    ['lastobject', { syntax: 'lastobject', description: 'The serial of your last used object in Razor.' }],
    ['lefthand', { syntax: 'lefthand', description: 'The serial of the item in your left hand.' }],
    ['righthand', { syntax: 'righthand', description: 'The serial of the item in your right hand.' }],
    ['ground', { syntax: 'ground', description: 'Represents the ground (used in drop commands).' }],
    // ─── Outlands Additions ──────────────────────────────────────────────────
    ['find', { syntax: "find ('serial') [src] [hue] [qty] [range]", description: 'Check if an item/mobile with the given serial exists. Parameters work like findtype.', example: "if find 0x4001A2 backpack\n    overhead 'Found it!'\nendif" }],
    ['findlayer', { syntax: "findlayer ('target') ('layer') [as ('alias')]", description: 'Search a character for an equipped item on a specific layer.', example: "if findlayer self gloves as mygloves\n    overhead 'Wearing gloves!'\nendif" }],
    ['findtypelist', { syntax: "findtypelist ('listname') ('name'/'graphicId') [src] [hue] [qty] [range]", description: 'Like findtype but adds all found serials to the named list.' }],
    ['noto', { syntax: "noto ('mobile') = ('notoriety')", description: 'Check the notoriety of a mobile. Valid values: innocent, friend, hostile, criminal, enemy, murderer, invulnerable.', example: "if noto lastObject = hostile\n    overhead 'Safe to attack!'\nendif" }],
    ['dead', { syntax: "dead ('mobile')", description: 'Check if a mobile is dead.', example: "if dead someMobile\n    overhead \"He's dead, Jim!\"\nendif" }],
    ['hue', { syntax: "hue ('object')", description: 'Get the hue/color value of an object.', example: "if hue someObject = 0x1809\n    overhead 'Found the right hue!'\nendif" }],
    ['counttype', { syntax: "counttype ('name'/'graphicId') [src] [hue] [range]", description: 'Returns the count of matching items in a container. Stackable items return the stack size.' }],
    ['gumpexists', { syntax: "gumpexists ('gumpId'/'any')", description: "Returns true if the specified gump is open. Use 'any' to check for any open gump." }],
    ['ingump', { syntax: "ingump ('text') ['gumpId'/'any']", description: "Returns true if the text appears in the given gump. Use 'any' for any open gump." }],
    ['bandaging', { syntax: 'bandaging', description: 'Returns remaining bandage time in seconds. Returns 0/false if not currently bandaging.', example: "if not bandaging\n    hotkey 'Bandage Self'\nendif" }],
    ['pvp', { syntax: 'pvp', description: 'Returns true if PvP script restrictions are active (structured PvP event or Faction flag).' }],
    ['casting', { syntax: 'casting', description: 'Returns true if the character is currently casting a spell.' }],
    ['atlist', { syntax: "atlist ('list name') ('index') [as ('alias')]", description: 'Returns the element at the given 0-based index in a list. Use as to capture the value.', example: "if atlist mylist 0 as first\n    overhead first\nendif" }],
    ['finddebuff', { syntax: "finddebuff ('debuff name')", description: 'Returns true if a specific debuff is currently applied to your character.' }],
    ['setskill', { syntax: "setskill ('skill name') ('up'/'down'/'lock')", description: 'Set the skill lock state for a skill. Valid values: up, down, lock.', example: "setskill 'Blacksmithing' up" }],
]);
// ---------------------------------------------------------------------------
// Spell Names
// ---------------------------------------------------------------------------
exports.SPELL_NAMES = [
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
exports.SKILL_NAMES = [
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
exports.DIRECTION_NAMES = [
    'North', 'South', 'East', 'West', 'Up', 'Down', 'Left', 'Right',
];
// ---------------------------------------------------------------------------
// Potion Types
// ---------------------------------------------------------------------------
exports.POTION_TYPES = [
    'heal', 'cure', 'refresh', 'nightsight', 'ns', 'explosion', 'strength', 'str', 'agility',
];
// ---------------------------------------------------------------------------
// Virtue Types
// ---------------------------------------------------------------------------
exports.VIRTUE_TYPES = ['honor', 'sacrifice', 'valor'];
// ---------------------------------------------------------------------------
// Ability Types
// ---------------------------------------------------------------------------
exports.ABILITY_TYPES = ['primary', 'secondary', 'stun', 'disarm'];
// ---------------------------------------------------------------------------
// Target Types
// ---------------------------------------------------------------------------
exports.TARGET_TYPES = [
    'closest', 'random', 'next', 'prev',
    'nonfriendly', 'friendly', 'enemy', 'red', 'murderer', 'gray', 'grey',
    'criminal', 'blue', 'innocent', 'friend', 'humanoid', 'monster',
    'clear', 'cancel',
];
// ---------------------------------------------------------------------------
// Layer Names
// ---------------------------------------------------------------------------
exports.LAYER_NAMES = [
    'righthand', 'lefthand', 'shoes', 'pants', 'shirt', 'head', 'gloves', 'ring',
    'talisman', 'neck', 'hair', 'waist', 'innertorso', 'bracelet', 'face',
    'facialhair', 'middletorso', 'earrings', 'arms', 'cloak', 'backpack',
    'outertorso', 'outerlegs', 'innerlegs', 'onehandedsecondary', 'quiver', 'outerbody',
];
// ---------------------------------------------------------------------------
// Notoriety Types (Outlands)
// ---------------------------------------------------------------------------
exports.NOTORIETY_TYPES = [
    'innocent', 'friend', 'hostile', 'criminal', 'enemy', 'murderer', 'invulnerable',
];
// ---------------------------------------------------------------------------
// Setskill Lock Values (Outlands)
// ---------------------------------------------------------------------------
exports.SETSKILL_VALUES = ['up', 'down', 'lock'];
// ---------------------------------------------------------------------------
// Completion Items
// ---------------------------------------------------------------------------
function makeDoc(entry) {
    let value = entry.description;
    if (entry.example) {
        value += `\n\n**Example:**\n\`\`\`\n${entry.example}\n\`\`\``;
    }
    return { kind: node_1.MarkupKind.Markdown, value };
}
function makeItem(label, kind, insertText, insertTextFormat) {
    const entry = exports.HOVER_MAP.get(label.toLowerCase());
    const item = {
        label,
        kind,
        data: label,
    };
    if (insertText !== undefined) {
        item.insertText = insertText;
        item.insertTextFormat = insertTextFormat !== null && insertTextFormat !== void 0 ? insertTextFormat : node_1.InsertTextFormat.PlainText;
    }
    if (entry) {
        item.detail = entry.syntax;
        item.documentation = makeDoc(entry);
    }
    return item;
}
// ─── Command Completions ───────────────────────────────────────────────────
exports.COMMAND_COMPLETIONS = [
    // Action
    makeItem('attack', node_1.CompletionItemKind.Function, "attack '${1:serial}'", node_1.InsertTextFormat.Snippet),
    makeItem('cast', node_1.CompletionItemKind.Function, "cast '${1:spell name}'", node_1.InsertTextFormat.Snippet),
    makeItem('classicuo', node_1.CompletionItemKind.Function, "classicuo '${1:setting}' '${2:value}'", node_1.InsertTextFormat.Snippet),
    makeItem('cuo', node_1.CompletionItemKind.Function, "cuo '${1:setting}' '${2:value}'", node_1.InsertTextFormat.Snippet),
    makeItem('cleardragdrop', node_1.CompletionItemKind.Function),
    makeItem('clearhands', node_1.CompletionItemKind.Function, "clearhands '${1|left,right,both|}'", node_1.InsertTextFormat.Snippet),
    makeItem('cooldown', node_1.CompletionItemKind.Function, "cooldown '${1:name}' ${2:30000}", node_1.InsertTextFormat.Snippet),
    makeItem('dclick', node_1.CompletionItemKind.Function, "dclick '${1:serial}'", node_1.InsertTextFormat.Snippet),
    makeItem('dclicktype', node_1.CompletionItemKind.Function, "dclicktype '${1:item name}'", node_1.InsertTextFormat.Snippet),
    makeItem('dress', node_1.CompletionItemKind.Function, "dress '${1:dress list name}'", node_1.InsertTextFormat.Snippet),
    makeItem('drop', node_1.CompletionItemKind.Function, "drop '${1:serial}' ${2:layer}", node_1.InsertTextFormat.Snippet),
    makeItem('droprelloc', node_1.CompletionItemKind.Function, 'droprelloc ${1:1} ${2:1}', node_1.InsertTextFormat.Snippet),
    makeItem('getlabel', node_1.CompletionItemKind.Function, "getlabel '${1:serial}' '${2:var}'", node_1.InsertTextFormat.Snippet),
    makeItem('hotkey', node_1.CompletionItemKind.Function, "hotkey '${1:hotkey name}'", node_1.InsertTextFormat.Snippet),
    makeItem('interrupt', node_1.CompletionItemKind.Function),
    makeItem('lift', node_1.CompletionItemKind.Function, "lift '${1:serial}'", node_1.InsertTextFormat.Snippet),
    makeItem('lifttype', node_1.CompletionItemKind.Function, "lifttype '${1:item name}'", node_1.InsertTextFormat.Snippet),
    makeItem('music', node_1.CompletionItemKind.Function, 'music ${1:11}', node_1.InsertTextFormat.Snippet),
    makeItem('potion', node_1.CompletionItemKind.Function, "potion '${1|heal,cure,refresh,nightsight,explosion,strength,agility|}'", node_1.InsertTextFormat.Snippet),
    makeItem('rename', node_1.CompletionItemKind.Function, "rename '${1:serial}' '${2:name}'", node_1.InsertTextFormat.Snippet),
    makeItem('random', node_1.CompletionItemKind.Function, 'random ${1:100}', node_1.InsertTextFormat.Snippet),
    makeItem('script', node_1.CompletionItemKind.Function, "script '${1:script name}'", node_1.InsertTextFormat.Snippet),
    makeItem('setability', node_1.CompletionItemKind.Function, "setability '${1|primary,secondary,stun,disarm|}'", node_1.InsertTextFormat.Snippet),
    makeItem('setvar', node_1.CompletionItemKind.Function, "setvar '${1:variable name}'", node_1.InsertTextFormat.Snippet),
    makeItem('setvariable', node_1.CompletionItemKind.Function, "setvariable '${1:variable name}'", node_1.InsertTextFormat.Snippet),
    makeItem('skill', node_1.CompletionItemKind.Function, "skill '${1:skill name}'", node_1.InsertTextFormat.Snippet),
    makeItem('sound', node_1.CompletionItemKind.Function, "sound '${1:serial}'", node_1.InsertTextFormat.Snippet),
    makeItem('unsetvar', node_1.CompletionItemKind.Function, "unsetvar '${1:variable name}'", node_1.InsertTextFormat.Snippet),
    makeItem('virtue', node_1.CompletionItemKind.Function, "virtue '${1|honor,sacrifice,valor|}'", node_1.InsertTextFormat.Snippet),
    makeItem('walk', node_1.CompletionItemKind.Function, "walk '${1|North,South,East,West,Up,Down,Left,Right|}'", node_1.InsertTextFormat.Snippet),
    makeItem('wait', node_1.CompletionItemKind.Function, 'wait ${1:1000}', node_1.InsertTextFormat.Snippet),
    makeItem('pause', node_1.CompletionItemKind.Function, 'pause ${1:1000}', node_1.InsertTextFormat.Snippet),
    makeItem('undress', node_1.CompletionItemKind.Function),
    // Agent
    makeItem('organizer', node_1.CompletionItemKind.Function, 'organizer ${1:1}', node_1.InsertTextFormat.Snippet),
    makeItem('restock', node_1.CompletionItemKind.Function, 'restock ${1:1}', node_1.InsertTextFormat.Snippet),
    makeItem('scavenger', node_1.CompletionItemKind.Function, "scavenger '${1|clear,add,on,off,set|}'", node_1.InsertTextFormat.Snippet),
    makeItem('sell', node_1.CompletionItemKind.Function),
    makeItem('useonce', node_1.CompletionItemKind.Function),
    // Gumps
    makeItem('gumpresponse', node_1.CompletionItemKind.Function, 'gumpresponse ${1:4}', node_1.InsertTextFormat.Snippet),
    makeItem('gumpclose', node_1.CompletionItemKind.Function),
    makeItem('menu', node_1.CompletionItemKind.Function, 'menu ${1:0} ${2:0}', node_1.InsertTextFormat.Snippet),
    makeItem('menuresponse', node_1.CompletionItemKind.Function, 'menuresponse ${1:3} ${2:4}', node_1.InsertTextFormat.Snippet),
    makeItem('promptresponse', node_1.CompletionItemKind.Function, "promptresponse '${1:response}'", node_1.InsertTextFormat.Snippet),
    makeItem('waitforgump', node_1.CompletionItemKind.Function, "waitforgump 'any'", node_1.InsertTextFormat.Snippet),
    makeItem('waitformenu', node_1.CompletionItemKind.Function, "waitformenu 'any'", node_1.InsertTextFormat.Snippet),
    makeItem('waitforprompt', node_1.CompletionItemKind.Function, "waitforprompt 'any'", node_1.InsertTextFormat.Snippet),
    // Ignore
    makeItem('clearignore', node_1.CompletionItemKind.Function),
    makeItem('ignore', node_1.CompletionItemKind.Function, "ignore '${1:serial}'", node_1.InsertTextFormat.Snippet),
    makeItem('unignore', node_1.CompletionItemKind.Function, "unignore '${1:serial}'", node_1.InsertTextFormat.Snippet),
    // List
    makeItem('clearlist', node_1.CompletionItemKind.Function, "clearlist '${1:list name}'", node_1.InsertTextFormat.Snippet),
    makeItem('createlist', node_1.CompletionItemKind.Function, "createlist '${1:list name}'", node_1.InsertTextFormat.Snippet),
    makeItem('poplist', node_1.CompletionItemKind.Function, "poplist '${1:list name}' '${2|front,back|}'", node_1.InsertTextFormat.Snippet),
    makeItem('pushlist', node_1.CompletionItemKind.Function, "pushlist '${1:list name}' '${2:item}'", node_1.InsertTextFormat.Snippet),
    makeItem('removelist', node_1.CompletionItemKind.Function, "removelist '${1:list name}'", node_1.InsertTextFormat.Snippet),
    // Messaging
    makeItem('alliance', node_1.CompletionItemKind.Function, "alliance '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('clearsysmsg', node_1.CompletionItemKind.Function),
    makeItem('emote', node_1.CompletionItemKind.Function, "emote '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('guild', node_1.CompletionItemKind.Function, "guild '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('overhead', node_1.CompletionItemKind.Function, "overhead '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('say', node_1.CompletionItemKind.Function, "say '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('msg', node_1.CompletionItemKind.Function, "msg '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('sysmsg', node_1.CompletionItemKind.Function, "sysmsg '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('waitforsysmsg', node_1.CompletionItemKind.Function, "waitforsysmsg '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('wfsysmsg', node_1.CompletionItemKind.Function, "wfsysmsg '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('whisper', node_1.CompletionItemKind.Function, "whisper '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('yell', node_1.CompletionItemKind.Function, "yell '${1:message}'", node_1.InsertTextFormat.Snippet),
    // Targeting
    makeItem('clearall', node_1.CompletionItemKind.Function),
    makeItem('lasttarget', node_1.CompletionItemKind.Function),
    makeItem('setlasttarget', node_1.CompletionItemKind.Function, "setlasttarget '${1:serial}'", node_1.InsertTextFormat.Snippet),
    makeItem('target', node_1.CompletionItemKind.Function, "target '${1|closest,random,next,prev,self,last|}'", node_1.InsertTextFormat.Snippet),
    makeItem('targetrelloc', node_1.CompletionItemKind.Function, 'targetrelloc ${1:1} ${2:1}', node_1.InsertTextFormat.Snippet),
    makeItem('targetloc', node_1.CompletionItemKind.Function, 'targetloc ${1:5000} ${2:1000} ${3:0}', node_1.InsertTextFormat.Snippet),
    makeItem('targettype', node_1.CompletionItemKind.Function, "targettype '${1:item name}'", node_1.InsertTextFormat.Snippet),
    makeItem('waitfortarget', node_1.CompletionItemKind.Function),
    makeItem('wft', node_1.CompletionItemKind.Function),
    // Timers
    makeItem('createtimer', node_1.CompletionItemKind.Function, "createtimer '${1:timer name}'", node_1.InsertTextFormat.Snippet),
    makeItem('removetimer', node_1.CompletionItemKind.Function, "removetimer '${1:timer name}'", node_1.InsertTextFormat.Snippet),
    makeItem('settimer', node_1.CompletionItemKind.Function, "settimer '${1:timer name}' ${2:0}", node_1.InsertTextFormat.Snippet),
    // Outlands
    makeItem('findtypelist', node_1.CompletionItemKind.Function, "findtypelist '${1:list}' '${2:item name}'", node_1.InsertTextFormat.Snippet),
    makeItem('setskill', node_1.CompletionItemKind.Function, "setskill '${1:skill name}' '${2|up,down,lock|}'", node_1.InsertTextFormat.Snippet),
    makeItem('warmode', node_1.CompletionItemKind.Function, "warmode '${1|on,off|}'", node_1.InsertTextFormat.Snippet),
];
// ─── Control Flow Snippet Completions ─────────────────────────────────────
exports.CONTROL_FLOW_COMPLETIONS = [
    {
        label: 'if',
        kind: node_1.CompletionItemKind.Keyword,
        detail: 'if (expression) ... endif',
        insertText: 'if ${1:condition}\n\t$0\nendif',
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        documentation: makeDoc(exports.HOVER_MAP.get('if')),
    },
    {
        label: 'if not',
        kind: node_1.CompletionItemKind.Keyword,
        detail: 'if not (expression) ... endif',
        insertText: 'if not ${1:condition}\n\t$0\nendif',
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        documentation: { kind: node_1.MarkupKind.Markdown, value: 'Execute commands if the expression is **false**.' },
    },
    makeItem('elseif', node_1.CompletionItemKind.Keyword, 'elseif ${1:condition}', node_1.InsertTextFormat.Snippet),
    makeItem('else', node_1.CompletionItemKind.Keyword),
    makeItem('endif', node_1.CompletionItemKind.Keyword),
    {
        label: 'while',
        kind: node_1.CompletionItemKind.Keyword,
        detail: 'while (expression) ... endwhile',
        insertText: 'while ${1:condition}\n\t$0\nendwhile',
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        documentation: makeDoc(exports.HOVER_MAP.get('while')),
    },
    makeItem('endwhile', node_1.CompletionItemKind.Keyword),
    {
        label: 'for',
        kind: node_1.CompletionItemKind.Keyword,
        detail: 'for (number) ... endfor',
        insertText: 'for ${1:10}\n\t$0\nendfor',
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        documentation: makeDoc(exports.HOVER_MAP.get('for')),
    },
    {
        label: 'foreach',
        kind: node_1.CompletionItemKind.Keyword,
        detail: "foreach ('var') in ('list') ... endfor",
        insertText: "foreach '${1:item}' in '${2:list}'\n\t$0\nendfor",
        insertTextFormat: node_1.InsertTextFormat.Snippet,
        documentation: makeDoc(exports.HOVER_MAP.get('foreach')),
    },
    makeItem('endfor', node_1.CompletionItemKind.Keyword),
    makeItem('break', node_1.CompletionItemKind.Keyword),
    makeItem('continue', node_1.CompletionItemKind.Keyword),
    makeItem('stop', node_1.CompletionItemKind.Keyword),
    makeItem('loop', node_1.CompletionItemKind.Keyword),
    makeItem('replay', node_1.CompletionItemKind.Keyword),
];
// ─── Expression Completions ────────────────────────────────────────────────
exports.EXPRESSION_COMPLETIONS = [
    // Player attributes
    makeItem('hp', node_1.CompletionItemKind.Value),
    makeItem('hits', node_1.CompletionItemKind.Value),
    makeItem('maxhp', node_1.CompletionItemKind.Value),
    makeItem('maxhits', node_1.CompletionItemKind.Value),
    makeItem('mana', node_1.CompletionItemKind.Value),
    makeItem('maxmana', node_1.CompletionItemKind.Value),
    makeItem('stam', node_1.CompletionItemKind.Value),
    makeItem('maxstam', node_1.CompletionItemKind.Value),
    makeItem('str', node_1.CompletionItemKind.Value),
    makeItem('dex', node_1.CompletionItemKind.Value),
    makeItem('int', node_1.CompletionItemKind.Value),
    makeItem('weight', node_1.CompletionItemKind.Value),
    makeItem('maxweight', node_1.CompletionItemKind.Value),
    makeItem('followers', node_1.CompletionItemKind.Value),
    makeItem('maxfollowers', node_1.CompletionItemKind.Value),
    makeItem('diffhits', node_1.CompletionItemKind.Value),
    makeItem('diffhp', node_1.CompletionItemKind.Value),
    makeItem('diffmana', node_1.CompletionItemKind.Value),
    makeItem('diffstam', node_1.CompletionItemKind.Value),
    makeItem('diffweight', node_1.CompletionItemKind.Value),
    makeItem('hidden', node_1.CompletionItemKind.Value),
    makeItem('mounted', node_1.CompletionItemKind.Value),
    makeItem('paralyzed', node_1.CompletionItemKind.Value),
    makeItem('poisoned', node_1.CompletionItemKind.Value),
    makeItem('warmode', node_1.CompletionItemKind.Value),
    makeItem('invuln', node_1.CompletionItemKind.Value),
    makeItem('invul', node_1.CompletionItemKind.Value),
    makeItem('blessed', node_1.CompletionItemKind.Value),
    makeItem('lhandempty', node_1.CompletionItemKind.Value),
    makeItem('rhandempty', node_1.CompletionItemKind.Value),
    makeItem('name', node_1.CompletionItemKind.Value),
    makeItem('itemcount', node_1.CompletionItemKind.Value),
    makeItem('queued', node_1.CompletionItemKind.Value),
    // Expressions with arguments
    makeItem('skill', node_1.CompletionItemKind.Value, "skill '${1:skill name}'", node_1.InsertTextFormat.Snippet),
    makeItem('position', node_1.CompletionItemKind.Value, 'position ${1:x} ${2:y}', node_1.InsertTextFormat.Snippet),
    makeItem('count', node_1.CompletionItemKind.Value, "count '${1:item name}'", node_1.InsertTextFormat.Snippet),
    makeItem('counter', node_1.CompletionItemKind.Value, "counter '${1:name}'", node_1.InsertTextFormat.Snippet),
    makeItem('findtype', node_1.CompletionItemKind.Value, "findtype '${1:item name}'", node_1.InsertTextFormat.Snippet),
    makeItem('insysmsg', node_1.CompletionItemKind.Value, "insysmsg '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('insysmessage', node_1.CompletionItemKind.Value, "insysmessage '${1:message}'", node_1.InsertTextFormat.Snippet),
    makeItem('targetexists', node_1.CompletionItemKind.Value, "targetexists '${1|any,beneficial,harmful,neutral|}'", node_1.InsertTextFormat.Snippet),
    makeItem('varexist', node_1.CompletionItemKind.Value, "varexist '${1:variable}'", node_1.InsertTextFormat.Snippet),
    makeItem('varexists', node_1.CompletionItemKind.Value, "varexists '${1:variable}'", node_1.InsertTextFormat.Snippet),
    makeItem('findbuff', node_1.CompletionItemKind.Value, "findbuff '${1:buff name}'", node_1.InsertTextFormat.Snippet),
    makeItem('inlist', node_1.CompletionItemKind.Value, "inlist '${1:list}' '${2:item}'", node_1.InsertTextFormat.Snippet),
    makeItem('list', node_1.CompletionItemKind.Value, "list '${1:list name}'", node_1.InsertTextFormat.Snippet),
    makeItem('listexists', node_1.CompletionItemKind.Value, "listexists '${1:list name}'", node_1.InsertTextFormat.Snippet),
    makeItem('timer', node_1.CompletionItemKind.Value, "timer '${1:name}'", node_1.InsertTextFormat.Snippet),
    makeItem('timerexists', node_1.CompletionItemKind.Value, "timerexists '${1:name}'", node_1.InsertTextFormat.Snippet),
    makeItem('timerexist', node_1.CompletionItemKind.Value, "timerexist '${1:name}'", node_1.InsertTextFormat.Snippet),
    makeItem('poplist', node_1.CompletionItemKind.Value, "poplist '${1:list}' '${2|front,back|}' as '${3:item}'", node_1.InsertTextFormat.Snippet),
    // ─── Outlands Expressions ────────────────────────────────────────────────
    makeItem('find', node_1.CompletionItemKind.Value, "find '${1:serial}'", node_1.InsertTextFormat.Snippet),
    makeItem('findlayer', node_1.CompletionItemKind.Value, 'findlayer ${1:self} ${2|righthand,lefthand,gloves,head,ring,neck,shirt,pants,shoes,innertorso,bracelet,arms,cloak,outertorso,outerlegs,innerlegs,hair,waist,backpack,talisman,earrings,face,facialhair,middletorso,onehandedsecondary,quiver,outerbody|}', node_1.InsertTextFormat.Snippet),
    makeItem('noto', node_1.CompletionItemKind.Value, 'noto ${1:lastObject} = ${2|innocent,friend,hostile,criminal,enemy,murderer,invulnerable|}', node_1.InsertTextFormat.Snippet),
    makeItem('dead', node_1.CompletionItemKind.Value, 'dead ${1:serial}', node_1.InsertTextFormat.Snippet),
    makeItem('hue', node_1.CompletionItemKind.Value, 'hue ${1:serial}', node_1.InsertTextFormat.Snippet),
    makeItem('counttype', node_1.CompletionItemKind.Value, "counttype '${1:item name}'", node_1.InsertTextFormat.Snippet),
    makeItem('gumpexists', node_1.CompletionItemKind.Value, "gumpexists '${1|any|}'", node_1.InsertTextFormat.Snippet),
    makeItem('ingump', node_1.CompletionItemKind.Value, "ingump '${1:text}'", node_1.InsertTextFormat.Snippet),
    makeItem('bandaging', node_1.CompletionItemKind.Value),
    makeItem('pvp', node_1.CompletionItemKind.Value),
    makeItem('casting', node_1.CompletionItemKind.Value),
    makeItem('atlist', node_1.CompletionItemKind.Value, "atlist '${1:list}' ${2:0} as '${3:item}'", node_1.InsertTextFormat.Snippet),
    makeItem('finddebuff', node_1.CompletionItemKind.Value, "finddebuff '${1:debuff name}'", node_1.InsertTextFormat.Snippet),
    makeItem('findtypelist', node_1.CompletionItemKind.Value, "findtypelist '${1:list}' '${2:item name}'", node_1.InsertTextFormat.Snippet),
    makeItem('cooldown', node_1.CompletionItemKind.Value, "cooldown '${1:name}'", node_1.InsertTextFormat.Snippet),
];
// ─── Logical Keyword Completions ──────────────────────────────────────────
exports.LOGICAL_COMPLETIONS = [
    makeItem('and', node_1.CompletionItemKind.Operator),
    makeItem('or', node_1.CompletionItemKind.Operator),
    makeItem('not', node_1.CompletionItemKind.Operator),
    makeItem('as', node_1.CompletionItemKind.Keyword),
    makeItem('in', node_1.CompletionItemKind.Keyword),
];
// ─── Pre-defined Variable Completions ─────────────────────────────────────
exports.VARIABLE_COMPLETIONS = [
    makeItem('self', node_1.CompletionItemKind.Variable),
    makeItem('backpack', node_1.CompletionItemKind.Variable),
    makeItem('hands', node_1.CompletionItemKind.Variable),
    makeItem('index', node_1.CompletionItemKind.Variable),
    makeItem('lasttarget', node_1.CompletionItemKind.Variable),
    makeItem('last', node_1.CompletionItemKind.Variable),
    makeItem('lastobject', node_1.CompletionItemKind.Variable),
    makeItem('lefthand', node_1.CompletionItemKind.Variable),
    makeItem('righthand', node_1.CompletionItemKind.Variable),
    makeItem('ground', node_1.CompletionItemKind.Variable),
];
/** Build a completion item list from string values (e.g., spell names). */
function buildStringCompletions(values, kind = node_1.CompletionItemKind.Value) {
    return values.map((v) => ({ label: v, kind, insertText: v }));
}
//# sourceMappingURL=completionData.js.map