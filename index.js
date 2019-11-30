const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000;
const fs = require('fs')
const youtubedl = require('youtube-dl');
let filename = "";

app.get('/', function (req, res) {
  fs.readFile("index.html", function(err, data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
})

app.get('/download/:id*', function(req, res){
  let videoUrlQuery = req.query.v;
  let videoUrl = req.params[0] + "?v=" + videoUrlQuery;
    console.log("videoUrlQuery = " + videoUrlQuery );

  const video = youtubedl(videoUrl,
    ['--format=18'],
    { cwd: __dirname })

  filename = videoUrlQuery+".mp4";

  video.on('info', function(info) {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
    filenameL = info._filename.length - 16;
    filename = info._filename.substring(0, filenameL) + ".mp4";

    video.pipe(fs.createWriteStream(filename));
    })
  video.on('end', function() {
    file = __dirname + '/' + filename;
    res.download(file, file, function (err) {
     if (err) {
       console.log(err)
     } else {
       console.log("deleting from server...")
       setTimeout( function(){
         fs.unlink(file,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
          })
        }
        , 500);
     }
   })
  })
})

var server = app.listen(PORT, function () {
    console.log("Youtube downloader is running on port " + PORT);
});
