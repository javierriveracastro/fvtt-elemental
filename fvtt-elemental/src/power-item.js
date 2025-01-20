// Power (Arcane) documenta and DataModel
/* globals foundry, Item */

export class PowerDataModel extends foundry.abstract.TypeDataModel {
  // noinspection JSUnusedGlobalSymbols
  static defineSchema() {
    const { fields } = foundry.data;
    return {
      description: new fields.HTMLField(),
      difficulty: new fields.NumberField({ integer: true, initial: 1 }),
      casting_time: new fields.StringField({ initial: "1 round" }),
      range: new fields.StringField({ initial: "" }),
      duration: new fields.StringField({ initial: "" }),
      concentration: new fields.BooleanField({ initial: false }),
      innate: new fields.BooleanField({ initial: false }),
    };
  }

  get theme_name() {
    return game.elemental.current_theme.power_name;
  }
}
