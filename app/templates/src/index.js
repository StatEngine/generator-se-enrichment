import { <%= baseClass %> } from 'se-enrichment-base';

class <%= className %> extends <%= baseClass %> {
  constructor({
    src = {},
    normalizedInput = {
      latitude: 'address.latitude',
      longitude: 'address.longitude',
      timestamp: 'description.event_opened',
    },
    normalizedOutput = ['<%= normalizedOutput %>'],
    params = {},
  } = {}) {
    super({ src, normalizedInput, normalizedOutput, params });
  }

  normalize(rawResults) {
    return rawResults;
  }
}

module.exports = function factory() {
  return <%= className %>;
};
exports = module.exports;
