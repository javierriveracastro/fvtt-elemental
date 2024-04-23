// Classes for all the roll dialogs
/* globals foundry, game, FormApplication, console */

import { StatCheck } from "./stat-check.js";

export class StatCheckDialog extends FormApplication {
  constructor(actor, derived_stat) {
    super();
    this.actor = actor;
    this.derived_stat = derived_stat;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/stat_check_dialog.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 300,
    });
  }

  /**
   * Retrieves data for the dialog form.
   *
   * @param {object} options - Options for data retrieval
   * @return {object} Data including theme information
   */
  async getData(options) {
    const data = super.getData(options);
    return {
      ...data,
      theme: game.elemental.current_theme,
      actor: this.actor,
      derived_stat: this.derived_stat,
    };
  }

  async _updateObject(ev, form_data) {
    const roll_string = ev.submitter.value === "2d" ? "d6*d6" : "d6*d6*d6";
    const difficulty_number = this.actor.system[`current_${this.derived_stat}`];
    const capitalized_stat =
      this.derived_stat.charAt(0).toUpperCase() + this.derived_stat.slice(1);
    const roll = new StatCheck(
      roll_string,
      {},
      { target_number: difficulty_number, stat: capitalized_stat },
    );
    await roll.evaluate();
    roll.toMessage().catch((err) => {
      console.error("Error while rolling: ", err);
    });
  }
}

export class AttributeRollDialog extends FormApplication {
  constructor(actor, attribute) {
    super();
    this.actor = actor;
    this.default_attribute = attribute;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/attribute_roll_dialog.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 500,
    });
  }

  async getData(options) {
    const data = super.getData(options);
    const attribute_names = [];
    for (let attribute of game.elemental.attributes) {
      attribute_names.push(
        game.i18n.localize(`Elemental.Attributes.${attribute}`),
      );
    }
    return {
      ...data,
      theme: game.elemental.current_theme,
      actor: this.actor,
      attribute_names: attribute_names,
    };
  }
}
