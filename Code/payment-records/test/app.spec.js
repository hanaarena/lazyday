const app = require('../app')
const assert = require('assert')

describe('without NODE_ENV', () => {
  it('should default to development', () => {
    var NODE_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = ''
    process.env.NODE_ENV = NODE_ENV
    assert.equal(app.env, 'development')
  })
})
