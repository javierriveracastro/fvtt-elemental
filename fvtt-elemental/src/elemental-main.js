// Entry point for Elemental
/* globals Actors, ActorSheet, CONFIG, Hooks */

import { ElementaCharacterSheet } from "./character-sheet.js";
import { CharacterDataModel } from "./character-actor.js";

Hooks.on("init", () => {
  CONFIG.Actor.systemDataModels.character = CharacterDataModel;
});

Actors.unregisterSheet("core", ActorSheet);
Actors.registerSheet("elemental", ElementaCharacterSheet, {
  types: ["character"],
  makeDefault: true,
  label: "Elemental.ElementalSheet",
});
