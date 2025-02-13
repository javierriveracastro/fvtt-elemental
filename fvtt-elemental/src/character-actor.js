// Character document and DataModel classes
/* global foundry, Actor, game */

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

// Some getters are only used on template, we suppress errors
// noinspection JSUnusedGlobalSymbols
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
    for (const skill of this.skills()) {
      if (skill.system.is_flaw) {
        skill_xp -= skill.system.score;
      } else {
        skill_xp += this.calculate_xp(skill.system.score);
      }
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

  get awareness_skills_powers() {
    return this.items.filter((item) => {
      return (
        item.type === "power" ||
        (item.type === "skill" && item.system.attribute === "awareness")
      );
    });
  }
  
  get powers() {
    return this.items.filter((item) => {
      return item.type === "power";
    });
  }

  get will_skills() {
    return this.skills("will");
  }

  get equipment() {
    const equipment_groups = {};
    const equipment_list = this.items.filter((item) => {
      return item.type === "equipment";
    });
    for (const equipment of equipment_list) {
      if (!equipment_groups.hasOwnProperty(equipment.system.elemental_type)) {
        const extra_name =
          equipment.system.elemental_type === "armor"
            ? `  (${this.armor})`
            : "";
        const formated_mane =
          equipment.system.elemental_type.charAt(0).toUpperCase() +
          equipment.system.elemental_type.slice(1).toLowerCase();
        equipment_groups[equipment.system.elemental_type] = {
          Name:
            game.i18n.localize(`Elemental.EquipmentTypes.${formated_mane}`) +
            extra_name,
          Equipment: [],
        };
      }
      equipment_groups[equipment.system.elemental_type].Equipment.push(
        equipment,
      );
    }
    return Object.values(equipment_groups);
  }

  skills(attribute) {
    if (attribute) {
      return this.items.filter((item) => {
        return item.system.attribute === attribute && item.type === "skill";
      });
    }
    return this.items.filter((item) => {
      return item.type === "skill";
    });
  }

  skills_by_name(name) {
    return this.items.filter((item) => {
      return item.name === name && item.type === "skill";
    });
  }

  attribute_value_from_string(string) {
    const lowercase_string = string.toLowerCase();
    return this.system[lowercase_string];
  }

  get armor() {
    let armor = 0;
    for (const item of this.items.filter((item) => {
      return item.type === "equipment";
    })) {
      armor += item.system.armor;
    }
    return armor;
  }
}
