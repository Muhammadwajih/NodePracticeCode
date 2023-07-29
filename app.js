// var http = require('http');
// http.createServer(function(req ,res){
//     res.write("Hello From Server");
//     res.end()
// }).listen(8000)

const express = require("express");

var app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/api/users", require("./routes/api/users"));

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("listing on port http://%s:%s ", host, port);
});
