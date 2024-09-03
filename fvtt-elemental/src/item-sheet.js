// Item sheet
/* globals ItemSheet, game, foundry */

export class ElementaItemSheet extends ItemSheet {
  // noinspection JSUnusedGlobalSymbols
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 600,
      height: 300,
    });
  }

  get template() {
    return "/systems/fvtt-elemental/templates/item.hbs";
  }

  async getData(options) {
    const data = super.getData(options);
    const attributes_select = {
      agility: game.i18n.localize("Elemental.Attributes.Agility"),
      toughness: game.i18n.localize("Elemental.Attributes.Toughness"),
      awareness: game.i18n.localize("Elemental.Attributes.Awareness"),
      will: game.i18n.localize("Elemental.Attributes.Will"),
    };
    return {
      ...data,
      theme: game.elemental.current_theme,
      attributes: attributes_select,
    };
  }
}

export class ElementalEquipmentSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 800,
      height: 430,
    });
  }

  get template() {
    return "/systems/fvtt-elemental/templates/equipment.hbs";
  }

  async getData(options) {
    const data = super.getData(options);
    const equipment_types_select = {
      weapon: game.i18n.localize("Elemental.EquipmentTypes.Weapon"),
      armor: game.i18n.localize("Elemental.EquipmentTypes.Armor"),
      vehicle: game.i18n.localize("Elemental.EquipmentTypes.Vehicle"),
      miscellaneous: game.i18n.localize(
        "Elemental.EquipmentTypes.Miscellaneous",
      ),
    };
    return {
      ...data,
      equipment_types_select,
      theme: game.elemental.current_theme,
    };
  }
}
