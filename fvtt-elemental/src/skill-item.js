// Skill document and DataModel classes
/* global foundry, Item, game */

export class SkillDataModel extends foundry.abstract.TypeDataModel {
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

  get theme_name() {
    return this.is_flaw
      ? game.elemental.current_theme.flaw_name
      : game.elemental.current_theme.skill_name;
  }

  get extra_name() {
    return "";
  }
}

export class ElementalItem extends Item {
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    if (this.type === "skill") {
      this.updateSource({
        img: "/icons/svg/explosion.svg",
      });
    } else if (this.type === "power") {
      this.updateSource({
        img: "/icons/svg/daze.svg",
      });
    }
  }
}
