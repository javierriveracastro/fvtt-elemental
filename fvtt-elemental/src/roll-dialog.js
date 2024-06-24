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
    this.selected_difficulty = 0;
    this.resist_roll = false;
    this.dif_roll = false;
    this.originating_roll = "";
    this.modfiers = [];
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
      resist_roll: this.resist_roll,
      dif_roll: this.dif_roll,
      skills: this.skills,
    };
  }

  get skills() {
    if (this.dif_roll) {
      return [];
    }
    return this.actor.skills().filter((skill) => {
      return !skill.system.dont_modify_rolls;
    });
  }

  async _updateObject(ev, form_data) {
    let attribute_modifier = 0;
    if (this.actor && this.selected_attribute) {
      attribute_modifier = this.actor.attribute_value_from_string(
        this.selected_attribute,
      );
    }
    const roll = new AttributeRoll(
      "1d6xo",
      {},
      {
        attribute: attribute_modifier,
        attribute_name: this.selected_attribute,
        actor_name: this.actor ? this.actor.name : "",
        difficulty: this.selected_difficulty,
        modifiers: this.modfiers,
        originating_roll: this.originating_roll,
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
    html.find(".elemental-difficulty-selection").click((ev) => {
      this.select_difficulty(ev.currentTarget, html);
    });
    html.find(".elemental-add-modifier").click((ev) => {
      this.modfiers.push(ev.currentTarget.dataset.value);
      this.add_modifier_toast(ev.currentTarget.dataset.value, html);
    });
  }

  select_attribute(element, html) {
    this.select_one(
      html,
      element,
      "elemental-attribute-selection",
      "selected_attribute",
    );
  }

  select_difficulty(element, html) {
    this.select_one(
      html,
      element,
      "elemental-difficulty-selection",
      "selected_difficulty",
    );
  }

  select_one(html, element, class_name, property) {
    for (let current_element of html.find(`.${class_name}`)) {
      if (current_element === element) {
        current_element.className =
          game.elemental.current_theme.roll_option_selected;
        this[property] = current_element.dataset.value;
      } else {
        current_element.className =
          game.elemental.current_theme.roll_option_unselected;
      }
      current_element.classList.add("elemental-attribute-selection");
    }
  }

  add_modifier_toast(value, html) {
    const id = window.crypto.getRandomValues(new Uint32Array(1))[0];
    const sign = value > 0 ? "+" : "";
    const new_modifier_toast = `<div class="${game.elemental.current_theme.modifier_toast} id${id}" data-value="${value}">
      <span>${sign}${value}</span>
      <button id="id${id}" type="button" class="${game.elemental.current_theme.close_icon}" >
        <i class="fas fa-xmark" style="margin-top: -1px; margin-left: 0.5px;"></i>
      </button>
    </div>`;
    html.find("#elemental-active-modifiers").append(new_modifier_toast);
    html.find("#id" + id).click((ev) => {
      const value = ev.currentTarget.parentElement.dataset.value;
      const index = this.modfiers.indexOf(value);
      this.modfiers.splice(index, 1);
      ev.currentTarget.parentElement.remove();
    });
  }
}
