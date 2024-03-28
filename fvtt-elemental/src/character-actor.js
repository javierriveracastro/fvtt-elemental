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
      current_move: new fields.NumberField({ integer: true, initial: 0 }),
      current_health: new fields.NumberField({ integer: true, initial: 0 }),
      current_initiative: new fields.NumberField({ integer: true, initial: 0 }),
      current_spirit: new fields.NumberField({ integer: true, initial: 0 }),
      character_description: new fields.HTMLField(),
      other_characters: new fields.HTMLField(),
      background_notes: new fields.HTMLField(),
      experience_reserve: new fields.NumberField({ integer: true, initial: 0 }),
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

  get max_move() {
    return this.agility_xp + 9;
  }

  get max_health() {
    return this.toughness_xp + 9;
  }

  get max_initiative() {
    return this.awareness_xp + 9;
  }

  get max_spirit() {
    return this.will_xp + 9;
  }

  get attribute_xp() {
    return (
      this.toughness_xp + this.agility_xp + this.awareness_xp + this.will_xp
    );
  }

  get skill_xp() {
    let skill_xp = 0;
    for (let skill of this.skills()) {
      skill_xp += this.calculate_xp(skill.system.score);
    }
    return skill_xp;
  }

  get total_xp() {
    return this.attribute_xp + this.skill_xp;
  }

  calculate_xp(value) {
    return (value * (value + 1)) / 2;
  }

  get agility_skills() {
    return this.skills("agility");
  }

  get toughness_skills() {
    return this.skills("toughness");
  }

  get awareness_skills() {
    return this.skills("awareness");
  }

  get will_skills() {
    return this.skills("will");
  }

  skills(attribute) {
    if (attribute) {
      return this.items.filter((item) => {
        return (item.system.attribute === attribute) && (item.type === "skill");
      });
    }
    return this.items.filter((item) => {
      return item.type === "skill";
    });
  }
}
