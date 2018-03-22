'use strict';

const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);
const fs = require('fs');

const port = process.env.PORT || 3000;
const host = '127.0.0.1'

app.get('/', (req,res) => {
    res.sendFile(__dirname+'/index.html');
});

var cost = {vigilante:0,khanjali:0,tampa:0};

fs.readFile('cost.json', 'utf-8', (err,data) => {
    if (!err) cost = JSON.parse(data);
    io.sockets.emit('update', cost);
});

io.on('connection', socket => {
    socket.emit('update', cost);

    socket.on('destroy', vehicle => {
        cost[vehicle] += 10;
        socket.emit('update', cost);
        fs.writeFile('cost.json', JSON.stringify(cost), err => {if (err) console.log(err);});
    });
});

http.listen(port,host, () => {
    console.log(`Server ${host} on port ${port}`);
});
