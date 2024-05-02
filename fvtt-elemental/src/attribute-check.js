// Class that represents an attribute check
/* global Roll, game, CONST, CONFIG, ChatMessage */

export class AttributeRoll extends Roll {
  constructor(attribute, data = {}, options = {}) {
    super(`1d6 + ${options.attribute}`, data, options);
  }
}
