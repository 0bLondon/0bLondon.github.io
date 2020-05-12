const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '.')));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/sudoku_solver', (req, res) => {

    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['./scripts/driver.py', req.body['board']]);

    pyProg.stdout.on('data', function(data) {
        	res.write(data);
        	res.end();
    });
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '.', 'index.html'));
});
app.listen(port);