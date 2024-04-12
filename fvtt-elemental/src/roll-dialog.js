// Classes for all the roll dialogs
/* globals foundry, game, FormApplication */

export class StatCheckDialog extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "systems/fvtt-elemental/templates/stat_check_dialog.hbs",
      closeOnSubmit: true,
      submitOnClose: false,
      submitOnChange: false,
      width: 250,
    });
  }

  async getData(options) {
    const data = super.getData(options);
    return { ...data, theme: game.elemental.current_theme };
  }

  async _updateObject(ev, form_data) {
    console.log(ev.submitter.value);
  }
}
