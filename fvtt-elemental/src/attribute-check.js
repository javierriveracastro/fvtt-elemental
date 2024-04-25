// Class that represents an attribute check
/* global Roll, game, CONST, CONFIG, ChatMessage */

export class AttributeRoll extends Roll {
  constructor(formula, data = {}, options = {}) {
    super(formula, data, options);
  }
}
