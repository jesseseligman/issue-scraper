const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/build'));
app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

app.listen(port, () => {
});


module.exports = app;