// Classes for all the roll dialogs
/* globals foundry, game, FormApplication, console */

import { StatCheck } from "./stat-check.js";
import { AttributeRoll } from "./attribute-check.js";

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
    this.selected_attribute = attribute;
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
      attribute_names.push({
        english_name: attribute,
        name: game.i18n.localize(`Elemental.Attributes.${attribute}`),
        selected: attribute.toLowerCase() === this.selected_attribute,
      });
    }
    return {
      ...data,
      theme: game.elemental.current_theme,
      actor: this.actor,
      attribute_names: attribute_names,
    };
  }

  async _updateObject(ev, form_data) {
    const roll = new AttributeRoll(
      "1d6",
      {},
      {
        attribute: this.actor.attribute_value_from_string(
          this.selected_attribute,
        ),
      },
    );
    await roll.evaluate();
    roll.toMessage().catch((err) => {
      console.error("Error while rolling: ", err);
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".elemental-attribute-selection").click((ev) => {
      this.select_attribute(ev.currentTarget, html);
    });
  }

  select_attribute(element, html) {
    for (let current_element of html.find(".elemental-attribute-selection")) {
      if (current_element === element) {
        current_element.className =
          game.elemental.current_theme.roll_option_selected;
        this.selected_attribute = current_element.dataset.attribute;
      } else {
        current_element.className =
          game.elemental.current_theme.roll_option_unselected;
      }
      current_element.classList.add("elemental-attribute-selection");
    }
  }
}
