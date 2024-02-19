// Entry point for Elemental
/* globals Actors, ActorSheet */

import { ElementaCharacterSheet } from "./character-sheet.js";

Actors.unregisterSheet("core", ActorSheet);
Actors.registerSheet("elemental", ElementaCharacterSheet, {
  types: ["character"],
  makeDefault: true,
  label: "Elemental.ElementalSheet",
});
