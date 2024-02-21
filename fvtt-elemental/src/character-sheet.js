// Character Sheet
/* globals ActorSheet, game */

export class ElementaCharacterSheet extends ActorSheet {
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
}
