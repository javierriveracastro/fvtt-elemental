// Entry point for Elemental
/* globals Actors, ActorSheet, CONFIG, Hooks, game, console, loadTemplates, Items, ItemSheet */

import { ElementaCharacterSheet } from "./character-sheet.js";
import { CharacterDataModel, ElementalActor } from "./character-actor.js";
import { BASE_THEME } from "./theme.js";
import { ElementalItem, SkillDataModel } from "./skill-item.js";
import { ElementaItemSheet } from "./item-sheet.js";
import { StatCheck } from "./stat-check.js";
import { AttributeRoll } from "./attribute-check.js";
import { AttributeRollDialog } from "./roll-dialog.js";

Hooks.on("init", () => {
  CONFIG.Actor.dataModels.character = CharacterDataModel;
  CONFIG.Actor.documentClass = ElementalActor;
  CONFIG.Item.dataModels.skill = SkillDataModel;
  CONFIG.Item.documentClass = ElementalItem;
  CONFIG.Dice.rolls.push(StatCheck);
  CONFIG.Dice.rolls.push(AttributeRoll);

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("elemental", ElementaCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Elemental.ElementalSheet",
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("elemental", ElementaItemSheet, {
    types: ["skill"],
    makeDefault: true,
    label: "Elemental.ElementalSheet",
  });

  const handlebars_templatePaths = [
    "systems/fvtt-elemental/templates/character_base.hbs",
    "systems/fvtt-elemental/templates/character_description.hbs",
    "systems/fvtt-elemental/templates/skill_row.hbs",
  ];
  loadTemplates(handlebars_templatePaths).then(() => {
    console.info("Better Rolls templates preloaded");
  });

  game.elemental = {};
  game.elemental.current_theme = BASE_THEME;
  game.elemental.attributes = ["Agility", "Toughness", "Awareness", "Will"];
});

Hooks.on("ready", () => {
  const chat_control = document.getElementsByClassName("control-buttons");
  const container = document.createElement("a");
  container.innerHTML =
    "<a id='elemental-dif-roll' role='button' data-tooltip='Dif Roll'><i class='fa-solid fa-dice'></i></a>";
  container.firstChild.addEventListener("click", () => {
    const dif_roll = new AttributeRollDialog();
    dif_roll.dif_roll = true;
    dif_roll.render(true);
  });
  chat_control[0].appendChild(container.firstChild);
});
