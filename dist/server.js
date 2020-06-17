"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);
var _helmet = require('helmet'); var _helmet2 = _interopRequireDefault(_helmet);
var _app = require('./app'); var _app2 = _interopRequireDefault(_app);

_dotenv2.default.config();

_app2.default.listen(process.env.PORT || 3000);

_app2.default.use(_helmet2.default.call(void 0, ));
