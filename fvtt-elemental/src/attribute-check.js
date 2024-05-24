// Class that represents an attribute check
/* global Roll, game, CONST, CONFIG, ChatMessage, renderTemplate */

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
    this.is_difficulty_roll = is_difficulty_roll;
    this.actor_name = options.actor_name;
    this.badges = badges;
  }

  get title() {
    return this.is_difficulty_roll
      ? `${game.i18n.localize("Elemental.Difficulty")} ${game.i18n.localize("Elemental.Roll")}`
      : `${this.actor_name} ${game.i18n.localize("Elemental.AttributeRoll")}`;
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
    };
    return renderTemplate(template, chatData);
  }
}
