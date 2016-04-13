'use strict';

var router = require('koa-router')();

router.get('/', regeneratorRuntime.mark(function _callee(next) {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return this.render('index', {
            title: 'Hello World Koa!'
          });

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}));

module.exports = router;