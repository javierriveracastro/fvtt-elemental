// Character document and DataModel classes
/* global foundry*/

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  // noinspection JSUnusedGlobalSymbols
  static defineSchema() {
    const { fields } = foundry.data;
    return {
      race: new fields.StringField({ initial: "" }),
      title: new fields.StringField({ initial: "" }),
      agility: new fields.NumberField({integer: true}),
      toughness: new fields.NumberField({integer: true}),
      awareness: new fields.NumberField({integer: true}),
      will: new fields.NumberField({integer: true})
    };
  }
}
