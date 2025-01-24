// Class that represents an attribute check
/* global Roll, game, renderTemplate, fromUuid */

import { AttributeRollDialog } from "./roll-dialog.js";

/*
 * Old class used for all Attribute Rolls, this should be removed
 */
export class AttributeRoll extends Roll {
  constructor(formula, data = {}, options = {}) {
    let is_difficulty_roll = !!options.difficulty;
    let badges = [];
    let base_formula = generate_roll_formula(options, badges);
    super(base_formula, data, options);
    this.originating_roll = undefined;
    if (options.originating_roll) {
      fromUuid(options.originating_roll).then((message) => {
        this.originating_roll = message.rolls[0];
      });
    }
    this.is_difficulty_roll = is_difficulty_roll;
    this.is_damage_roll = options.damage !== null;
    this.actor_name = options.actor_name;
    this.badges = badges;
  }

  async render({
    flavor,
    template = "systems/fvtt-elemental/templates/attribute_roll.hbs",
    isPrivate = false,
  } = {}) {
    if (!this._evaluated) {
      await this.evaluate({ async: true });
    }
    const chatData = {
      formula: isPrivate ? "???" : this._formula,
      flavor: isPrivate ? null : flavor,
      user: game.user.id,
      tooltip: isPrivate ? "" : await this.getTooltip(),
      total: isPrivate ? "?" : Math.round(this.total * 100) / 100,
      title: this.title,
      theme: game.elemental.current_theme,
      badges: this.badges,
      is_difficulty_roll: this.is_difficulty_roll,
      is_damage_roll: this.is_damage_roll,
      exploded: this.exploded,
      originating_roll: this.originating_roll,
      result_div: this.result_div,
    };
    return renderTemplate(template, chatData);
  }

  get title() {
    if (this.is_difficulty_roll) {
      let title = game.i18n.localize("Elemental.Difficulty");
      if (this.originating_roll) {
        title += ` vs (${this.originating_roll.total})`;
      }
      return title;
    }
    return `${this.actor_name} ${game.i18n.localize("Elemental.AttributeRoll")}`;
  }

  get result_div() {
    if (!this.originating_roll) {
      return "";
    }
    let positive_total = this.originating_roll.total;
    let oposing_total = this.total;
    if (this.originating_roll.is_difficulty_roll) {
      positive_total = this.total;
      oposing_total = this.originating_roll.total;
    }
    let critical = "";
    let critical_class_changes = "";
    if (this.is_critical) {
      critical = game.i18n.localize("Elemental.Rolls.Critical");
      critical_class_changes = " elemental-show-journal cursor-pointer";
    }
    if (positive_total > oposing_total) {
      return `<div class="${game.elemental.current_theme.result_success}${critical_class_changes}" data-journal="wA8KZqiXQGXhwfsG">${critical} ${game.i18n.localize("Elemental.Rolls.Success")}</div>`;
    } else if (positive_total < oposing_total) {
      return `<div class="${game.elemental.current_theme.result_failure}${critical_class_changes}" data-journal="SPVAUenofS7PCwuy">${critical} ${game.i18n.localize("Elemental.Rolls.Failure")}</div>`;
    }
    return `<div class="${game.elemental.current_theme.result_draw} elemental-show-journal cursor-pointer" data-journal="H4Inh1tYk6HX8vZk">${game.i18n.localize("Elemental.Rolls.Tie")}</div>`;
  }

  get is_critical() {
    let is_critical = true;
    for (const term of this.terms) {
      if (
        Object.prototype.hasOwnProperty.call(term, "_faces") &&
        term.results.length === 1
      ) {
        is_critical = false;
        break;
      }
    }
    for (const term of this.originating_roll.terms) {
      if (
        Object.prototype.hasOwnProperty.call(term, "_faces") &&
        term.results.length === 1
      ) {
        is_critical = false;
        break;
      }
    }
    return is_critical;
  }

  get exploded() {
    if (!this._evaluated) {
      return false;
    }
    let exploded = false;
    for (let term of this.terms) {
      if (Object.prototype.hasOwnProperty.call(term, "results")) {
        for (let result of term.results) {
          if (result.exploded) {
            exploded = true;
          }
        }
      }
    }
    return exploded;
  }
}

/**
 * Class for simple Attribute rolls that is also the base for more complex rolls
 */
export class AttributeBaseRoll extends Roll {
  constructor(formula, data = {}, options = {}) {
    let badges = [];
    let base_formula = generate_roll_formula(options, badges);
    super(base_formula, data, options);
    this.originating_roll = undefined;
    if (options.originating_roll) {
      fromUuid(options.originating_roll).then((message) => {
        this.originating_roll = message.rolls[0];
      });
    }
    this.actor_name = options.actor_name;
    this.badges = badges;
  }

  async render({
    flavor,
    template = "systems/fvtt-elemental/templates/attribute_roll.hbs",
    isPrivate = false,
  } = {}) {
    if (!this._evaluated) {
      await this.evaluate({ async: true });
    }
    const chatData = {
      formula: isPrivate ? "???" : this._formula,
      flavor: isPrivate ? null : flavor,
      user: game.user.id,
      tooltip: isPrivate ? "" : await this.getTooltip(),
      total: isPrivate ? "?" : Math.round(this.total * 100) / 100,
      title: this.title,
      theme: game.elemental.current_theme,
      badges: this.badges,
      exploded: this.exploded,
      originating_roll: this.originating_roll,
      result_div: this.result_div,
    };
    return renderTemplate(template, chatData);
  }

  get title() {
    return `${this.actor_name} ${game.i18n.localize("Elemental.AttributeRoll")}`;
  }

  get result_div() {
    if (!this.originating_roll) {
      return "";
    }
    let positive_total = this.originating_roll.total;
    let oposing_total = this.total;
    if (this.originating_roll.is_difficulty_roll) {
      positive_total = this.total;
      oposing_total = this.originating_roll.total;
    }
    let critical = "";
    let critical_class_changes = "";
    if (this.is_critical) {
      critical = game.i18n.localize("Elemental.Rolls.Critical");
      critical_class_changes = " elemental-show-journal cursor-pointer";
    }
    if (positive_total > oposing_total) {
      return `<div class="${game.elemental.current_theme.result_success}${critical_class_changes}" data-journal="wA8KZqiXQGXhwfsG">${critical} ${game.i18n.localize("Elemental.Rolls.Success")}</div>`;
    } else if (positive_total < oposing_total) {
      return `<div class="${game.elemental.current_theme.result_failure}${critical_class_changes}" data-journal="SPVAUenofS7PCwuy">${critical} ${game.i18n.localize("Elemental.Rolls.Failure")}</div>`;
    }
    return `<div class="${game.elemental.current_theme.result_draw} elemental-show-journal cursor-pointer" data-journal="H4Inh1tYk6HX8vZk">${game.i18n.localize("Elemental.Rolls.Tie")}</div>`;
  }

  get is_critical() {
    let is_critical = true;
    for (const term of this.terms) {
      if (
        Object.prototype.hasOwnProperty.call(term, "_faces") &&
        term.results.length === 1
      ) {
        is_critical = false;
        break;
      }
    }
    for (const term of this.originating_roll.terms) {
      if (
        Object.prototype.hasOwnProperty.call(term, "_faces") &&
        term.results.length === 1
      ) {
        is_critical = false;
        break;
      }
    }
    return is_critical;
  }

  get exploded() {
    if (!this._evaluated) {
      return false;
    }
    let exploded = false;
    for (let term of this.terms) {
      if (Object.prototype.hasOwnProperty.call(term, "results")) {
        for (let result of term.results) {
          if (result.exploded) {
            exploded = true;
          }
        }
      }
    }
    return exploded;
  }
}

export function start_new_diff_roll(origin = "") {
  const dif_roll = new AttributeRollDialog();
  dif_roll.dif_roll = true;
  dif_roll.selected_difficulty = 2;
  dif_roll.originating_roll = origin;
  dif_roll.render(true);
}

export function start_new_opposite_roll(actor, origin = "") {
  const opposing_roll = new AttributeRollDialog(actor);
  opposing_roll.originating_roll = origin;
  opposing_roll.resist_roll = true;
  opposing_roll.render(true);
}

function get_conditional_options(options, base_formula, badges) {
  for (const key in options.conditional_modifiers_active) {
    if (
      !Object.prototype.hasOwnProperty.call(
        options.conditional_modifiers_active,
        key,
      )
    ) {
      continue;
    }
    const modifier = options.conditional_modifiers_active[key];
    const sign = modifier.value > 0 ? "+" : "";
    base_formula += `${sign}${modifier.value}`;
    badges.push(`${sign}${modifier.value} ${modifier.name}`);
  }
  return base_formula;
}

function get_status_modifiers(options, base_formula, badges) {
  if (options.status_modifiers) {
    for (const status of options.status_modifiers) {
      const sign = status.value > 0 ? "+" : "";
      base_formula += `${sign}${status.value}`;
      badges.push(`${sign}${status.value} ${status.name}`);
    }
  }
  return base_formula;
}

function get_flaw_modifiers(options, base_formula, badges) {
  if (options.flaws_active) {
    for (const flaw in options.flaws_active) {
      if (!Object.prototype.hasOwnProperty.call(options.flaws_active, flaw)) {
        continue;
      }
      base_formula += `-${options.flaws_active[flaw].value}`;
      badges.push(
        `-${options.flaws_active[flaw].value} ${options.flaws_active[flaw].name}`,
      );
    }
  }
  return base_formula;
}

function generate_roll_formula(options, badges) {
  let base_formula = "1d6";
  if (
    !Object.prototype.hasOwnProperty.call(options, "attribute") ||
    options.attribute !== 0
  ) {
    base_formula += "xo";
  }
  if (options.attribute) {
    base_formula += ` + ${options.attribute}`;
    badges.push(`+${options.attribute} ${options.attribute_name}`);
  }
  if (options.skill) {
    base_formula += ` + ${options.skill}`;
    const sign = options.skill > 0 ? "+" : "";
    badges.push(`${sign}${options.skill} ${options.skill_name}`);
  }
  if (options.difficulty) {
    base_formula += ` + ${options.difficulty}`;
    badges.push(
      `+${options.difficulty} ${game.i18n.localize("Elemental.Difficulty")}`,
    );
  }
  if (options.damage) {
    base_formula += ` + ${options.damage}`;
    badges.push(`+${options.damage} ${game.i18n.localize("Elemental.Damage")}`);
  }
  if (options.range_modifier) {
    base_formula += `${options.range_modifier}`;
    badges.push(
      `${options.range_modifier} ${game.i18n.localize("Elemental.Range")}`,
    );
  }
  for (let modifier of options.modifiers) {
    const sign = modifier > 0 ? "+" : "";
    base_formula += `${sign}${modifier}`;
    badges.push(`${sign}${modifier}`);
  }
  base_formula = get_conditional_options(options, base_formula, badges);
  base_formula = get_status_modifiers(options, base_formula, badges);
  base_formula = get_flaw_modifiers(options, base_formula, badges);
  return base_formula;
}
