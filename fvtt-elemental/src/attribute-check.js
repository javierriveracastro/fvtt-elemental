// Class that represents an attribute check
/* global Roll */

export class AttributeCheck {
  constructor(original_formula) {
    this.original_roll = new AttributeRoll(original_formula);
    this.resist_roll = null;
  }

  async toMessage() {
    await this.original_roll.toMessage();
  }
}

export class AttributeRoll extends Roll {
  constructor(formula, data = {}, options = {}) {
    super(formula, data, options);
  }
}
