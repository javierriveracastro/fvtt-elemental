// Class that represents an attribute check
/* global Roll, game, CONST, CONFIG, ChatMessage */

export class AttributeRoll extends Roll {
  constructor(attribute, data = {}, options = {}) {
    let base_formula = "1d6xo";
    if (options.attribute) {
      base_formula += ` + ${options.attribute}`;
    }
    if (options.difficulty) {
      base_formula += ` + ${options.difficulty}`;
    }
    for (let modifier of options.modifiers) {
      const sign = modifier > 0 ? "+" : "";
      base_formula += `${sign}${modifier}`;
    }
    super(base_formula, data, options);
  }
}
