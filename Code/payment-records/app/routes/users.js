'use strict';

var router = require('koa-router')();

router.get('/', regeneratorRuntime.mark(function _callee(next) {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          this.body = 'this a users response!';

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));

module.exports = router;