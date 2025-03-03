// Equipment DataModel
/* globals foundry */

export class EquipmentDataModel extends foundry.abstract.TypeDataModel {
  // noinspection JSUnusedGlobalSymbols
  static defineSchema() {
    const { fields } = foundry.data;
    return {
      elemental_type: new fields.StringField({ initial: "weapon" }),
      ammo: new fields.NumberField({ integer: true, initial: 0 }),
      reload: new fields.NumberField({ integer: true, initial: 0 }),
      damage: new fields.StringField({ initial: "" }),
      aoe: new fields.NumberField({ integer: true, initial: 1 }),
      lbs: new fields.NumberField({ integer: true, initial: 0 }),
      notes: new fields.StringField({ initial: "" }),
      description: new fields.HTMLField(),
      armor: new fields.NumberField({ integer: true, initial: 0 }),
      quantity: new fields.NumberField({ integer: true, initial: 1 }),
      range: new fields.NumberField({ integer: true, initial: 0 }),
      crew: new fields.NumberField({ integer: true, initial: 0 }),
      passengers: new fields.NumberField({ integer: true, initial: 0 }),
      agi: new fields.NumberField({ integer: true, initial: 0 }),
      move: new fields.StringField({ initial: "" }),
      health: new fields.NumberField({ integer: true, initial: 0 }),
      heavy_weapon: new fields.BooleanField({ initial: false }),
      default_skill: new fields.StringField({ initial: "" }),
    };
  }

  get is_weapon() {
    return this.elemental_type === "weapon";
  }

  get is_armor() {
    return this.elemental_type === "armor";
  }

  get is_vehicle() {
    return this.elemental_type === "vehicle";
  }

  get is_miscellaneous() {
    return this.elemental_type === "miscellaneous";
  }

  get has_armor() {
    return this.is_vehicle || this.is_armor;
  }

  get has_damage() {
    return Boolean(this.damage);
  }

  get extra_name() {
    return "";
  }
}
