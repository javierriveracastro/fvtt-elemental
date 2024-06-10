// Class that represents an attribute check
/* global Roll, game, CONST, CONFIG, ChatMessage, renderTemplate, fromUuid */

import { AttributeRollDialog } from "./roll-dialog.js";

export class AttributeRoll extends Roll {
  constructor(attribute, data = {}, options = {}) {
    let is_difficulty_roll = false;
    let base_formula = "1d6xo";
    let badges = [];
    if (options.attribute) {
      base_formula += ` + ${options.attribute}`;
      badges.push(`+${options.attribute} ${options.attribute_name}`);
    }
    if (options.difficulty) {
      base_formula += ` + ${options.difficulty}`;
      badges.push(
        `+${options.difficulty} ${game.i18n.localize("Elemental.Difficulty")}`,
      );
      is_difficulty_roll = true;
    }
    for (let modifier of options.modifiers) {
      const sign = modifier > 0 ? "+" : "";
      base_formula += `${sign}${modifier}`;
      badges.push(`${sign}${modifier}`);
    }
    super(base_formula, data, options);
    this.originating_roll = undefined;
    if (options.originating_roll) {
      fromUuid(options.originating_roll).then((message) => {
        this.originating_roll = message.rolls[0];
      });
    }
    this.is_difficulty_roll = is_difficulty_roll;
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
    const critical = this.is_critical
      ? game.i18n.localize("Elemental.Rolls.Critical")
      : "";
    if (this.total < this.originating_roll.total) {
      return `<div class="${game.elemental.current_theme.result_success}">${critical} ${game.i18n.localize("Elemental.Rolls.Success")}</div>`;
    } else if (this.total > this.originating_roll.total) {
      return `<div class="${game.elemental.current_theme.result_failure}">${critical} ${game.i18n.localize("Elemental.Rolls.Failure")}</div>`;
    }
    return `<div class="${game.elemental.current_theme.result_draw}">${game.i18n.localize("Elemental.Rolls.Tie")}</div>`;
  }

  get is_critical() {
    let is_critical = true;
    for (const term of this.terms) {
      if (term.hasOwnProperty("_faces") && term.results.length === 1) {
        is_critical = false;
        break;
      }
    }
    for (const term of this.originating_roll.terms) {
      if (term.hasOwnProperty("_faces") && term.results.length === 1) {
        is_critical = false;
        break;
      }
    }
    return is_critical;
  }
}

export function start_new_diff_roll(origin = "") {
  const dif_roll = new AttributeRollDialog();
  dif_roll.dif_roll = true;
  dif_roll.selected_difficulty = 3;
  dif_roll.originating_roll = origin;
  dif_roll.render(true);
}

export function start_new_opposite_roll(actor, origin = "") {
  const oppositing_roll = new AttributeRollDialog(actor);
  oppositing_roll.originating_roll = origin;
  oppositing_roll.resist_roll = true;
  oppositing_roll.render(true);
}
