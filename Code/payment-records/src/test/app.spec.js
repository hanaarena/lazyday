const app = require('../app')
const should = require('should')
const assert = require('assert')
const supertest = require('supertest')
const request = supertest.agent(app.listen())

describe('without NODE_ENV', () => {
  it('should default to development', () => {
    var NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = '';
    process.env.NODE_ENV = NODE_ENV;
    assert.equal(app.env, 'development');
  })
})
