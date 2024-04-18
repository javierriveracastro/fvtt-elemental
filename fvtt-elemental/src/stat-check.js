// Class that represents a stat check
/* globals Roll, game, renderTemplate */

export class StatCheck extends Roll {
  constructor(formula, data = {}, options = {}) {
    super(formula, data, options);
    this.target_number = options.target_number || 10;
    this.stat = options.stat || "";
  }

  get result_div() {
    if (this.total <= this.target_number) {
      return `<div class="${game.elemental.current_theme.result_success}">${game.i18n.localize("Elemental.Rolls.Success")}</div>`;
    }
    return `<div class="${game.elemental.current_theme.result_failure}">${game.i18n.localize("Elemental.Rolls.Failure")}</div>`;
  }

  async render({
    flavor,
    template = "systems/fvtt-elemental/templates/stat_check_roll.hbs",
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
      result_div: this.result_div,
      title: `${game.i18n.localize("Elemental.StatCheck")} - ${this.stat}`,
      theme: game.elemental.current_theme,
    };
    return renderTemplate(template, chatData);
  }
}
