// Classes for all the roll dialogs
/* globals foundry, game, FormApplication, console */

import { StatCheck } from "./stat-check.js";

export class StatCheckDialog extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/stat_check_dialog.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 250,
    });
  }

  async getData(options) {
    const data = super.getData(options);
    return { ...data, theme: game.elemental.current_theme };
  }

  async _updateObject(ev, form_data) {
    const roll_string = ev.submitter.value == "2d" ? "d6*d6" : "d6*d6*d6";
    const roll = new StatCheck(roll_string);
    await roll.evaluate();
    roll.toMessage().catch((err) => {
      console.error("Error while rolling: ", err);
    });
  }
}
