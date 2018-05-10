var qs = require("querystring");
var http = require("http");

var options = {
  "method": "POST",
  "hostname": "localhost",
  "port": "3001",
  "path": [
    "api",
    "events",
    "logInfo"
  ],
  "headers": {
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "no-cache"
  }
};
var req = http.request(options, function (res) {
  var chunks = [];
  res.on("data", function (chunk) {
    chunks.push(chunk);
  });
  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});
req.write(qs.stringify({ caller: 'ui', msg: 'test' }));
req.end();
console.log("End test")