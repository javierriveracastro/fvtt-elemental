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
      modify_damage: new fields.BooleanField({ initial: false }),
      fixed_modifier: new fields.NumberField({ integer: true, initial: 0 }),
      is_flaw: new fields.BooleanField({ initial: false }),
    };
  }

  get roll_modifier() {
    return this.fixed_modifier ? this.fixed_modifier : this.score;
  }
}

export class ElementalItem extends Item {
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    if (this.type === "skill") {
      this.updateSource({
        img: "/icons/svg/explosion.svg",
      });
    }
  }
}
