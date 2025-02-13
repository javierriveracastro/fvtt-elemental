// Character Sheet
/* globals ActorSheet, game, foundry */

import {
  StatCheckDialog,
  BaseAttributeRollDialog,
  SkillRollDialog,
  DamageRollDialog,
  WeaponRollDialog,
  ArcanePowerRollDialog,
} from "./roll-dialog.js";
import { BASE_THEME as current_theme } from "./theme.js";

export class ElementalCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 800,
      height: 760,
      current_tab: "base-tab",
    });
  }

  get template() {
    return "/systems/fvtt-elemental/templates/character.hbs";
  }

  getData(options) {
    const data = super.getData(options);
    return {
      ...data,
      theme: game.elemental.current_theme,
      current_tab: this.options.current_tab,
    };
  }

  activateListeners(jquery) {
    super.activateListeners(jquery);
    jquery.find(".elemental-tab-control").on("click", (ev) => {
      this.manageTabs(ev, jquery);
    });
    jquery.find(".elemental-refresh-derived").on("click", (ev) => {
      this.refresh_derived(ev);
    });
    jquery.find(".elemental-delete-skill").on("click", (ev) => {
      this.delete_item(ev);
    });
    jquery.find(".elemental-edit-skill").on("click", (ev) => {
      this.edit_item(ev);
    });
    jquery.find(".elemental-item-change-quantity").on("click", (ev) => {
      this.change_item_quantity(ev).catch(() => {
        console.error("Can't update item quantity");
      });
    });
    this.activate_roll_listeners(jquery);
    this.render_active_tab(jquery);
  }

  activate_roll_listeners(jquery) {
    jquery.find(".elemental-roll-derived").on("click", (ev) => {
      const derived_stat = ev.currentTarget.dataset.derived;
      const stat_roll_dialog = new StatCheckDialog(this.actor, derived_stat);
      stat_roll_dialog.render(true);
    });
    jquery.find(".elemental-roll-attribute").on("click", (ev) => {
      const attribute = ev.currentTarget.dataset.attribute;
      const attribute_roll_dialog = new BaseAttributeRollDialog(
        this.actor,
        attribute,
      );
      attribute_roll_dialog.render(true);
    });
    jquery.find(".elemental-roll-skill").on("click", (ev) => {
      const skill = this.actor.items.get(ev.currentTarget.dataset.itemId);
      if (skill.type === "power") {
        const power_roll_dialog = new ArcanePowerRollDialog(
          this.actor,
          "awareness",
          { power_id: skill.id },
        );
        power_roll_dialog.render(true);
      } else {
        const skill_roll_dialog = new SkillRollDialog(
          this.actor,
          skill.system.attribute,
          { skill_id: skill.id },
        );
        skill_roll_dialog.render(true);
      }
    });
    jquery.find(".elemental-roll-attack").on("click", (ev) => {
      const weapon = this.actor.items.get(ev.currentTarget.dataset.itemId);
      const attribute = weapon.system.heavy_weapon ? "awareness" : "agility";
      const attack_roll_dialog = new WeaponRollDialog(this.actor, attribute, {
        weapon: weapon,
      });
      attack_roll_dialog.render(true);
    });
    jquery.find(".elemental-roll-damage").on("click", (ev) => {
      const item = this.actor.items.get(ev.currentTarget.dataset.itemId);
      const attribute_id =
        item.system.damage.indexOf("TOU") > 0 ? "toughness" : null;
      let damage_mod = parseInt(
        item.system.damage.replace("@TOU", "").replace("+", ""),
      );
      if (isNaN(damage_mod)) {
        damage_mod = 0;
      }
      const damage_roll_dialog = new DamageRollDialog(
        this.actor,
        attribute_id,
        {
          damage_mod: damage_mod,
        },
      );
      damage_roll_dialog.render(true);
    });
  }

  manageTabs(ev, jquery) {
    const { current_theme } = game.elemental;
    let visible_content_id = "";
    for (const tab of jquery.find(".elemental-tab-control")) {
      if (tab === ev.currentTarget) {
        tab.classList =
          `elemental-tab-control ${current_theme.tab_active}`.split();
        visible_content_id = tab.dataset.tab;
      } else {
        tab.classList =
          `elemental-tab-control ${current_theme.tab_inactive}`.split();
      }
    }
    jquery.find(".tab-content").addClass("hidden");
    jquery.find(`#${visible_content_id}`).removeClass("hidden");
    this.options.current_tab = visible_content_id;
  }

  render_active_tab(jquery) {
    jquery.find(`#${this.options.current_tab}`).removeClass("hidden");
    for (const tab of jquery.find(".elemental-tab-control")) {
      if (tab.dataset.tab === this.options.current_tab) {
        tab.classList =
          `elemental-tab-control ${current_theme.tab_active}`.split();
      }
    }
  }

  refresh_derived(ev) {
    const actor_property = `max_${ev.currentTarget.dataset.derived}`;
    ev.currentTarget.nextElementSibling.value = this.actor[actor_property];
  }

  delete_item(ev) {
    const item_id = ev.currentTarget.dataset.itemId;
    const item = this.actor.items.get(item_id);
    item.delete();
  }

  edit_item(ev) {
    const item_id = ev.currentTarget.dataset.itemId;
    const item = this.actor.items.get(item_id);
    item.sheet.render(true);
  }

  async change_item_quantity(ev) {
    const item_id = ev.currentTarget.dataset.itemId;
    const item = this.actor.items.get(item_id);
    const action = ev.currentTarget.dataset.action;
    let quantity = item.system.quantity;
    if (action === "add") {
      quantity += 1;
    } else {
      quantity = Math.max(quantity - 1, 0);
    }
    await item.update({ "system.quantity": quantity });
  }

  async _updateObject(event, formData) {
    if (
      event.currentTarget &&
      event.currentTarget.classList.contains("elemental-skill-value")
    ) {
      await this.update_skill_value(
        event.currentTarget.name,
        event.currentTarget.value,
      );
    }
    return super._updateObject(event, formData);
  }

  async update_skill_value(skill_id, skill_value) {
    let real_value = parseInt(skill_value);
    real_value = Math.max(real_value, 1);
    real_value = Math.min(real_value, 3);
    const skill = this.actor.items.get(skill_id, { strict: true });
    await skill.update({ "system.score": real_value });
  }
}
