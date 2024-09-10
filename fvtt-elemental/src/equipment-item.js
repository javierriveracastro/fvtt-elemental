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
    };
  }
}
