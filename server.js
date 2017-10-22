const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const engines = require('consolidate');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000
const server = app.listen(port, ()=>{
    console.log(`Server initiated at port ${port}`);
})

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
app.use(cors())


app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use('/', routes);