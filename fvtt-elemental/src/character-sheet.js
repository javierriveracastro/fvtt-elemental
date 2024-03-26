// Character Sheet
/* globals ActorSheet, game, foundry */

export class ElementaCharacterSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 800,
      height: 760,
    });
  }

  get template() {
    return "/systems/fvtt-elemental/templates/character.hbs";
  }

  async getData(options) {
    const data = super.getData(options);
    return { ...data, theme: game.elemental.current_theme };
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
  }

  manageTabs(ev, jquery) {
    const { current_theme } = game.elemental;
    let visible_content_id = "";
    for (let tab of jquery.find(".elemental-tab-control")) {
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
}
