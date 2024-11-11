// Entry point for Elemental
/* globals Actors, ActorSheet, CONFIG, Hooks, game, console, loadTemplates, Items, ItemSheet */

import { ElementaCharacterSheet } from "./character-sheet.js";
import { CharacterDataModel, ElementalActor } from "./character-actor.js";
import { BASE_THEME } from "./theme.js";
import { ElementalItem, SkillDataModel } from "./skill-item.js";
import { ElementaItemSheet, ElementalEquipmentSheet } from "./item-sheet.js";
import { StatCheck } from "./stat-check.js";
import { AttributeRoll, start_new_diff_roll } from "./attribute-check.js";
import { addChatMessageListeners } from "./chat_messages_listeners.js";
import { change_condition_menu } from "./tokenHud.js";
import { EquipmentDataModel } from "./equipment-item.js";

Hooks.on("init", () => {
  CONFIG.Actor.dataModels.character = CharacterDataModel;
  CONFIG.Actor.documentClass = ElementalActor;
  CONFIG.Item.dataModels.skill = SkillDataModel;
  CONFIG.Item.dataModels.equipment = EquipmentDataModel;
  CONFIG.Item.documentClass = ElementalItem;
  CONFIG.Dice.rolls.push(StatCheck);
  CONFIG.Dice.rolls.push(AttributeRoll);

  CONFIG.statusEffects = [
    {
      img: "/icons/svg/skull.svg",
      id: "dead",
      name: "COMBAT.CombatantDefeated",
    },
    {
      img: "/systems/fvtt-elemental/assets/Impaired-1.svg",
      id: "slightly_impaired",
      name: "Elemental.Status.SlightlyImpaired",
      flags: { elemental: { conditional_mod: -1 } },
    },
    {
      img: "/systems/fvtt-elemental/assets/Impaired-2.svg",
      id: "impaired",
      name: "Elemental.Status.Impaired",
      flags: { elemental: { conditional_mod: -2 } },
    },
    {
      img: "/systems/fvtt-elemental/assets/Impaired-3.svg",
      id: "severely_impaired",
      name: "Elemental.Status.SeverelyImpaired",
      flags: { elemental: { conditional_mod: -3 } },
    },
    {
      img: "/icons/svg/paralysis.svg",
      id: "paralyzed",
      name: "Elemental.Status.Paralyzed",
      flags: { elemental: { conditional_mod: -3 } },
    },
  ];

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
    label: "Elemental.ItemElementalSheet",
  });
  Items.registerSheet("elemental", ElementalEquipmentSheet, {
    types: ["equipment"],
    makeDefault: true,
    label: "Elemental.EquipmentElementalSheet",
  });

  const handlebars_templatePaths = [
    "systems/fvtt-elemental/templates/character_base.hbs",
    "systems/fvtt-elemental/templates/character_description.hbs",
    "systems/fvtt-elemental/templates/character_equipment.hbs",
    "systems/fvtt-elemental/templates/skill_row.hbs",
    "systems/fvtt-elemental/templates/equipment_row.hbs",
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
  container.firstChild.addEventListener("click", start_new_diff_roll);
  chat_control[0].appendChild(container.firstChild);
});

Hooks.on("renderChatMessage", (message, html) => {
  if (message.rolls.length > 0) {
    addChatMessageListeners(message, html);
  }
});

Hooks.on("renderTokenHUD", change_condition_menu);
