// Item sheet
/* globals ItemSheet, game, foundry */

export class ElementaItemSheet extends ItemSheet {
  // noinspection JSUnusedGlobalSymbols
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 600,
      height: 300,
    });
  }

  get template() {
    return "/systems/fvtt-elemental/templates/item.hbs";
  }

  async getData(options) {
    const data = super.getData(options);
    return { ...data, theme: game.elemental.current_theme };
  }
}
