// Add listeners to tab messages.
import {start_new_diff_roll} from "./attribute-check.js";

export function addChatMessageListeners(message, html) {
    html.find(".elemental-roll-difficulty").on("click", () => {
        start_new_diff_roll(message.uuid);
    });
}