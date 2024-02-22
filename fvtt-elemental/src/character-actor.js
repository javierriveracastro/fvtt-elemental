// Character document and DataModel classes
/* global foundry*/

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  // noinspection JSUnusedGlobalSymbols
  static defineSchema() {
    const { fields } = foundry.data;
    return {
      race: new fields.StringField({ initial: "" }),
      title: new fields.StringField({ initial: "" }),
      agility: new fields.NumberField({ integer: true, initial: 0 }),
      toughness: new fields.NumberField({ integer: true, initial: 0 }),
      awareness: new fields.NumberField({ integer: true, initial: 0 }),
      will: new fields.NumberField({ integer: true, initial: 0 }),
    };
  }
}
