// Add listeners to tab messages.
/* global canvas, ui, game, console */

import {
  start_new_diff_roll,
  start_new_opposite_roll,
} from "./attribute-check.js";
import { apply_damage, modify_damage_dialog } from "./damage_application.js";
import { show_journal } from "./journals.js";

export function addChatMessageListeners(message, html) {
  html.find(".elemental-roll-difficulty").on("click", (ev) => {
    const default_difficulty = ev.currentTarget.dataset.defaultDifficulty;
    start_new_diff_roll(message.uuid, {
      selected_difficulty: default_difficulty,
    });
  });
  html.find(".elemental-roll-opposed").on("click", () => {
    if (canvas.tokens.controlled.length === 0) {
      ui.notifications.warn(
        game.i18n.localize("Elemental.Errors.NoTokenSelected"),
      );
      return;
    }
    for (const controlled_token of canvas.tokens.controlled) {
      start_new_opposite_roll(controlled_token.actor, message.uuid);
    }
  });
  html.find(".elemental-roll-damage").on("click", () => {
    apply_damage(message.rolls[0].total);
  });
  html.find(".elemental-roll-damage-mod").on("click", () => {
    modify_damage_dialog(message.rolls[0].total);
  });
  html.find(".elemental-show-journal").on("click", (ev) => {
    const journal = ev.currentTarget.dataset.journal;
    show_journal(journal).catch(() => {
      console.error("Can't show journal");
    });
  });
}
