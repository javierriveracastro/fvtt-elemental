// Add listeners to tab messages.
import {start_new_diff_roll} from "./attribute-check.js";

export function addChatMessageListeners(html) {
    html.find(".elemental-roll-difficulty").on("click", start_new_diff_roll);
}