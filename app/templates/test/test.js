import { expect } from 'chai';

import Plugin from '../src';

const Enrichment = Plugin();

describe('<%= className %>', () => {
  it('should create Enrichment', () => {
    const e = new Enrichment();
    expect(e).to.be.an('object');
  });
});
