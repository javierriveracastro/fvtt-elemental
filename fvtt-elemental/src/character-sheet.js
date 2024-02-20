// Character Sheet
/* globals ActorSheet, game */

export class ElementaCharacterSheet extends ActorSheet {
  get template() {
    return "/systems/fvtt-elemental/templates/character.hbs";
  }

  async getData(options) {
    const data = super.getData(options);
    return { ...data, theme: game.elemental.current_theme };
  }
}
