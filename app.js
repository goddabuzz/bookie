// Configuration
const config = require('./config');

/**
 * Require app
 */
var app = require('./lib/kosten')(config);

/**
 * Listen on port 80.
 */

app.listen(3003);