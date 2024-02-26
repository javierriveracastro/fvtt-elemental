// Entry point for Elemental
/* globals Actors, ActorSheet, CONFIG, Hooks, game, console, loadTemplates */

import { ElementaCharacterSheet } from "./character-sheet.js";
import { CharacterDataModel, ElementalActor } from "./character-actor.js";
import { BASE_THEME } from "./theme.js";

Hooks.on("init", () => {
  CONFIG.Actor.systemDataModels.character = CharacterDataModel;
  CONFIG.Actor.documentClass = ElementalActor;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("elemental", ElementaCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Elemental.ElementalSheet",
  });

  const handlebars_templatePaths = [
    "systems/fvtt-elemental/templates/character_base.hbs",
  ];
  loadTemplates(handlebars_templatePaths).then(() => {
    console.info("Better Rolls templates preloaded");
  });

  game.elemental = {};
  game.elemental.current_theme = BASE_THEME;
});
