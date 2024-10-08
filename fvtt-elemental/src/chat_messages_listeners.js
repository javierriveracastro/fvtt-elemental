// Add listeners to tab messages.
/* global canvas, ui, game */

import {
  start_new_diff_roll,
  start_new_opposite_roll,
} from "./attribute-check.js";

export function addChatMessageListeners(message, html) {
  html.find(".elemental-roll-difficulty").on("click", () => {
    start_new_diff_roll(message.uuid);
  });
  html.find(".elemental-roll-opposed").on("click", () => {
    if (canvas.tokens.controlled.length === 0) {
      ui.notifications.warn(
        game.i18n.localize("Elemental.Errors.NoTokenSelected"),
      );
      return;
    }
    for (let controlled_token of canvas.tokens.controlled) {
      start_new_opposite_roll(controlled_token.actor, message.uuid);
    }
  });
}
