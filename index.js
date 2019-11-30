const express = require('express')
const app = express()
const PORT = 5000;
const fs = require('fs')
const youtubedl = require('youtube-dl')

app.get('/home', function (req, res) {
  fs.readFile("index.html", function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
})

app.get('/downloadComplete', function (req, res) {
  fs.readFile("downloadComplete.html", function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
})

app.get(/^\/(.+)/, function(req, res){
  let videoUrlQuery = req.query.v;
  let videoUrl = req.params[0] + "?v=" + videoUrlQuery;
    console.log("videoUrlQuery = " + videoUrlQuery );
  const video = youtubedl(videoUrl,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname })
    // Will be called when the download starts.
    let filename = videoUrlQuery+".mp4";
    video.on('info', function(info) {
      console.log('Download started')
      console.log('filename: ' + info._filename)
      console.log('size: ' + info.size)
      filenameL = info._filename.length - 16;
      filename = info._filename.substring(0, filenameL) + ".mp4";

    video.pipe(fs.createWriteStream(filename))
    res.redirect("/downloadComplete");
      })

})

var server = app.listen(5000, function () {
    console.log("Youtube downloader is running on port " + PORT);
});
