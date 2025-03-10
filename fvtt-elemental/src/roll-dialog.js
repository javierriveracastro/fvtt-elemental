// Classes for all the roll dialogs
/* global foundry, game, FormApplication, canvas */

import { StatCheck } from "./stat-check.js";
import {
  AttributeBaseRoll,
  DifficultyRoll,
  DamageRoll,
  PowerRoll,
} from "./attribute-check.js";
import { apply_damage } from "./damage_application.js";

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
    const data = await super.getData(options);
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

/**
 * Class for common Attribute Rolls that is also the base case for other rolls.
 */
export class BaseAttributeRollDialog extends FormApplication {
  constructor(actor, attribute, options = {}) {
    // options used in sub-classes
    super();
    this.actor = actor;
    this.selected_attribute = attribute;
    this.resist_roll = false;
    this.originating_roll = "";
    this.modfiers = [];
    this.conditional_modifiers_active = {};
    this.flaws_active = {};
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/attribute_roll_basic.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 500,
    });
  }

  async getData(options) {
    const data = await super.getData(options);
    const attribute_names = [];
    const conditionals = [];
    for (const attribute of game.elemental.attributes) {
      attribute_names.push({
        english_name: attribute,
        name: game.i18n.localize(`Elemental.Attributes.${attribute}`),
        selected: attribute.toLowerCase() === this.selected_attribute,
      });
    }
    for (const effect of this.actor.effects) {
      if (
        effect.flags.elemental &&
        Object.prototype.hasOwnProperty.call(
          effect.flags.elemental,
          "conditional_mod",
        )
      ) {
        const conditional_mod = {
          name: effect.name,
          value: effect.flags.elemental.conditional_mod,
        };
        conditionals.push(conditional_mod);
        this.conditional_modifiers_active[effect.name] = conditional_mod;
      }
    }
    return {
      ...data,
      theme: game.elemental.current_theme,
      actor: this.actor,
      attribute_names: attribute_names,
      resist_roll: this.resist_roll,
      flaws: this.flaws,
      selected_skill: this.selected_skill,
      conditionals: conditionals,
    };
  }

  get flaws() {
    return this.actor.skills().filter((skill) => {
      return skill.system.is_flaw;
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".elemental-attribute-selection").click((ev) => {
      this.select_attribute(ev.currentTarget, html);
    });
    html.find(".elemental-conditional-selection").click((ev) => {
      this.select_conditional(ev.currentTarget);
    });
    html.find(".elemental-flaw-selection").click((ev) => {
      this.select_flaw(ev.currentTarget);
    });
    html.find(".elemental-add-modifier").click((ev) => {
      this.modfiers.push(ev.currentTarget.dataset.value);
      this.add_modifier_toast(ev.currentTarget.dataset.value, html);
    });
  }

  async _updateObject(ev, form_data) {
    const options = this.collect_roll_options();
    const roll = new AttributeBaseRoll("", {}, options);
    await roll.evaluate();
    roll.toMessage().catch((err) => {
      console.error("Error while rolling: ", err);
    });
  }

  collect_roll_options() {
    const options = {
      actor_name: this.actor ? this.actor.name : "",
      modifiers: this.modfiers,
      originating_roll: this.originating_roll,
    };
    if (this.actor && this.selected_attribute) {
      options.attribute = this.actor.attribute_value_from_string(
        this.selected_attribute,
      );
      options.attribute_name = this.selected_attribute;
    }
    options.flaws_active = this.flaws_active;
    options.conditional_modifiers_active = this.conditional_modifiers_active;
    options.damage = null; // Should be removed after refactoring
    return options;
  }

  select_attribute(element, html) {
    this.select_one(
      html,
      element,
      "elemental-attribute-selection",
      "selected_attribute",
    );
  }

  select_flaw(element) {
    this.multiple_select(
      element,
      "elemental-flaw-selection",
      this.flaws_active,
    );
  }

  select_conditional(element) {
    this.multiple_select(
      element,
      "elemental-conditional-selection",
      this.conditional_modifiers_active,
    );
  }

  select_one(html, element, class_name, property) {
    for (const current_element of html.find(`.${class_name}`)) {
      if (current_element === element) {
        current_element.className =
          game.elemental.current_theme.roll_option_selected;
        this[property] = current_element.dataset.value;
      } else {
        current_element.className =
          game.elemental.current_theme.roll_option_unselected;
      }
      current_element.classList.add(class_name);
    }
  }

  multiple_select(element, className, modifier_array) {
    if (
      element.className.indexOf(
        game.elemental.current_theme.roll_option_selected,
      ) !== -1
    ) {
      element.className = game.elemental.current_theme.roll_option_unselected;
      delete modifier_array[element.dataset.name];
    } else {
      element.className = game.elemental.current_theme.roll_option_selected;
      modifier_array[element.dataset.name] = {
        name: element.dataset.name,
        value: element.dataset.value,
      };
    }
    element.className += ` ${className}`;
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

export class SkillRollDialog extends BaseAttributeRollDialog {
  constructor(actor, attribute, options = {}) {
    super(actor, attribute, options);
    this.selected_skill = options.skill_id ? options.skill_id : null;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/attribute_roll_skills.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 500,
    });
  }

  get skills() {
    return this.actor.skills().filter((skill) => {
      return !(skill.system.dont_modify_rolls || skill.system.is_flaw);
    });
  }

  async getData(options) {
    const data = await super.getData(options);
    return {
      ...data,
      skills: this.skills,
      selected_skill: this.selected_skill,
    };
  }

  collect_roll_options() {
    const options = super.collect_roll_options();
    if (this.selected_skill) {
      const skill = this.actor.items.get(this.selected_skill);
      options.skill = skill.system.roll_modifier;
      options.skill_name = skill.name;
    }
    return options;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".elemental-skill-selection").click((ev) => {
      this.select_skill(ev.currentTarget, html);
    });
  }

  select_skill(element, html) {
    this.select_one(
      html,
      element,
      "elemental-skill-selection",
      "selected_skill",
    );
  }
}

export class DifficultyRollDialog extends BaseAttributeRollDialog {
  constructor(actor, attribute, options = {}) {
    super(actor, attribute, options);
    this.dif_roll = true;
    this.selected_difficulty = parseInt(options.selected_difficulty) || 2;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template:
        "systems/fvtt-elemental/templates/attribute_roll_difficulty.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 500,
    });
  }

  get flaws() {
    return [];
  }

  async _updateObject(ev, form_data) {
    const options = this.collect_roll_options();
    options.difficulty = this.selected_difficulty;
    const roll = new DifficultyRoll("", {}, options);
    await roll.evaluate();
    roll.toMessage().catch((err) => {
      console.error("Error while rolling: ", err);
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".elemental-difficulty-selection").click((ev) => {
      this.select_difficulty(ev.currentTarget, html);
    });
  }

  select_difficulty(element, html) {
    this.select_one(
      html,
      element,
      "elemental-difficulty-selection",
      "selected_difficulty",
    );
  }

  getData(options) {
    return {
      theme: game.elemental.current_theme,
      dif_roll: true,
      difficulties: [1, 2, 3, 4, 5, 6],
      selected_difficulty: this.selected_difficulty,
      title: game.i18n.localize("Elemental.DIFRoll"),
    };
  }
}

export class DamageRollDialog extends SkillRollDialog {
  constructor(actor, attribute, options = {}) {
    super(actor, attribute, options);
    this.damage_mod = options.damage_mod;
  }

  get skills() {
    return this.actor.skills().filter((skill) => {
      return skill.system.modify_damage && !skill.system.is_flaw;
    });
  }

  static get defaultOptions() {
    // Replace template when ready
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/attribute_roll_damage.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 500,
    });
  }

  async getData(options) {
    const data = await super.getData(options);
    return {
      ...data,
      damage_mod: this.damage_mod,
    };
  }

  collect_roll_options() {
    const options = super.collect_roll_options();
    options.range_modifier = this.selected_range;
    return options;
  }

  async _updateObject(ev, form_data) {
    const options = this.collect_roll_options();
    options.damage = this.damage_mod;
    const roll = new DamageRoll("", {}, options);
    await roll.evaluate();
    roll.toMessage().catch((err) => {
      console.error("Error while rolling: ", err);
    });
  }
}

export class WeaponRollDialog extends SkillRollDialog {
  constructor(actor, attribute, options = {}) {
    super(actor, attribute, options);
    this.weapon = options.weapon;
    this.selected_range = 0;
    this.selected_skill = null;
    if (options.weapon) {
      const skills = actor.skills_by_name(options.weapon.system.default_skill);
      if (skills.length > 0) {
        this.selected_skill = skills[0].id;
      }
    }
  }

  async getData() {
    const data = await super.getData();
    return this.add_weapon_data(data);
  }

  collect_roll_options() {
    const options = super.collect_roll_options();
    options.range_modifier = this.selected_range;
    return options;
  }

  add_weapon_data(data) {
    const new_data = { weapon_data: {} };
    if (this.weapon.system.range) {
      new_data.weapon_data.ranges = [
        { mod: -1, range: this.weapon.system.range * 2, selected: false },
        { mod: -2, range: this.weapon.system.range * 3, selected: false },
        { mod: -3, range: this.weapon.system.range * 4, selected: false },
      ];
      if (game.user.targets.size > 0) {
        const distance = canvas.grid.measurePath([
          this.actor.getActiveTokens()[0].center,
          game.user.targets.first().center,
        ]);
        if (distance.distance > this.weapon.system.range * 3) {
          new_data.weapon_data.ranges[2].selected = true;
          this.selected_range = -3;
        } else if (distance.distance > this.weapon.system.range * 2) {
          new_data.weapon_data.ranges[1].selected = true;
          this.selected_range = -2;
        } else if (distance.distance >= this.weapon.system.range) {
          new_data.weapon_data.ranges[0].selected = true;
          this.selected_range = -1;
        }
      }
    }
    return { ...data, ...new_data };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".elemental-range-selection").click((ev) => {
      this.select_range(ev.currentTarget, html);
    });
  }

  select_range(element, html) {
    this.select_one(
      html,
      element,
      "elemental-range-selection",
      "selected_range",
    );
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/attribute_roll_weapon.hbs", // Change when template is done
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 500,
    });
  }

  get title() {
    return `${game.i18n.localize("Elemental.AttributeRoll")} - ${this.weapon.name}, ${this.actor.name}`;
  }
}

export class ArcanePowerRollDialog extends BaseAttributeRollDialog {
  constructor(actor, attribute, options = {}) {
    super(actor, attribute, options);
    this.selected_power = options.power_id ? options.power_id : null;
    this.power_difficulty = options.power_difficulty
      ? options.power_difficulty
      : 1;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/attribute_roll_power.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 500,
    });
  }

  get powers() {
    return this.actor.powers;
  }

  async getData(options) {
    const data = await super.getData(options);
    return {
      ...data,
      powers: this.powers,
      selected_power: this.selected_power,
    };
  }

  collect_roll_options() {
    const options = super.collect_roll_options();
    if (this.selected_power) {
      const power = this.actor.items.get(this.selected_power);
      options.power = power.system.score;
      options.power_name = power.name;
    }
    return options;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".elemental-power-selection").click((ev) => {
      this.select_power(ev.currentTarget, html);
    });
  }

  select_power(element, html) {
    this.select_one(
      html,
      element,
      "elemental-power-selection",
      "selected_power",
    );
  }

  async _updateObject(ev, form_data) {
    const options = this.collect_roll_options();
    const roll = new PowerRoll("", {}, options);
    await roll.evaluate();
    roll.toMessage().catch((err) => {
      console.error("Error while rolling: ", err);
    });
    apply_damage(this.power_difficulty, this.actor, "current_spirit");
  }
}
