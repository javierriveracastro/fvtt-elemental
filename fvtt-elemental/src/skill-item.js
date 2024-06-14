// Skill document and DataModel classes
/* globals foundry, Item */

export class SkillDataModel extends foundry.abstract.TypeDataModel {
  // noinspection JSUnusedGlobalSymbols
  static defineSchema() {
    const { fields } = foundry.data;
    return {
      attribute: new fields.StringField({ initial: "agility" }),
      score: new fields.NumberField({ integer: true, initial: 1 }),
      description: new fields.HTMLField(),
      dont_modify_rolls: new fields.BooleanField({ initial: false }),
    };
  }
}

export class ElementalItem extends Item {
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    this.updateSource({
      img: "/icons/svg/explosion.svg",
    });
  }
}
