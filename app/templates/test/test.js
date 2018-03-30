import { expect } from 'chai';

import Plugin from '../src';

const P = Plugin();

describe('<%= className %>', () => {
  it('should create Enrichment', () => {
    const e = new P();
    expect(e).to.be.an('object');
  });
});
