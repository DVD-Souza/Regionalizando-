const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Routes
app.use('/users', require('./routes/user.routes'));
app.use('/words', require('./routes/word.routes'));
app.use('/meanings', require('./routes/meaning.routes'));
app.use('/interactions', require('./routes/interaction.routes'));
app.use('/locations', require('./routes/location.routes'));
app.use('/meaning-logs', require('./routes/meaningLog.routes'));
app.use('/update-logs', require('./routes/updateLog.routes'));


