/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your system, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your system
 */

// Import TypeScript modules
import { registerSettings } from './module/settings.js';
import { preloadTemplates } from './module/preloadTemplates.js';
import { registerHandlebars } from './module/handlebars';

import { RisusActor } from './module/actor/actor';
import { RisusCharacterSheet } from './module/actor/actorSheet';
import { RisusItem } from './module/item/item';
import { RisusItemSheet } from './module/item/itemSheet';

/* ------------------------------------ */
/* Initialize system										*/
/* ------------------------------------ */
Hooks.once('init', async function () {
	console.log('risus | Initializing risus');

	// Assign custom classes and constants here
	game.risus = {
		RisusActor,
		RisusItem
	};

	CONFIG.Actor.entityClass = RisusActor;
	CONFIG.Item.entityClass = RisusItem;

	// Register custom system settings
	registerSettings();
	registerHandlebars();

	// Preload Handlebars templates
	await preloadTemplates();

	// Register custom sheets (if any)
	Actors.unregisterSheet('core', ActorSheet);
	Actors.registerSheet('risus', RisusCharacterSheet, {
		types: ['character'],
		makeDefault: true,
	});

	Items.unregisterSheet('core', ItemSheet);
	Items.registerSheet('risus', RisusItemSheet, { makeDefault: true });
});

/* ------------------------------------ */
/* Setup system							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
	// Do anything after initialization but before
	// ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {
	// Do anything once the system is ready
});

// Add any additional hooks if necessary
