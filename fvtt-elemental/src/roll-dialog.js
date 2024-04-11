// Classes for all the roll dialogs
/* globals foundry */

export class StatCheckDialog extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/stat_check_dialog.hbs",
      classes: ["elemental-css"],
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
    });
  }

  async _updateObject(ev, form_data) {
    console.log("UPDATE");
    console.log(ev, form_data);
  }
}
