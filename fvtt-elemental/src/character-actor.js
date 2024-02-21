// Character document and DataModel classes
/* global foundry*/

export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const { fields } = foundry.data;
    return {
      race: new fields.StringField({ initial: "" }),
      title: new fields.StringField({ initial: "" }),
    };
  }
}
