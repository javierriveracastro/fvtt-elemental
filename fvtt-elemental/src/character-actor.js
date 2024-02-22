// Character document and DataModel classes
/* global foundry, Actor */

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

export class ElementalActor extends Actor {
  // noinspection JSUnusedGlobalSymbols
  get agility_xp() {
    return this.calculate_xp(this.system.agility);
  }

  // noinspection JSUnusedGlobalSymbols
  get toughness_xp() {
    return this.calculate_xp(this.system.toughness);
  }

  // noinspection JSUnusedGlobalSymbols
  get awareness_xp() {
    return this.calculate_xp(this.system.awareness);
  }

  // noinspection JSUnusedGlobalSymbols
  get will_xp() {
    return this.calculate_xp(this.system.will);
  }

  calculate_xp(value) {
    return (value * (value + 1)) / 2;
  }
}
