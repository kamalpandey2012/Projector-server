const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
import Position from './Position';
import EditResponse from './EditResponse';

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('word count', function (count) {
    console.log(`word count, ${count}`);
  });

  socket.on('update_time', function (data) {
    // console.log('data', data);
    socket.broadcast.emit('update_time', data);
  });
  socket.on('load_file_to_editor', function (data) {
    console.log('Load file to editor event fired---->');
    const fileObj = JSON.parse(data);
    const filteredPath = fileObj.fileName.replace(fileObj.root, '');
    socket.broadcast.emit('load_file_to_editor', filteredPath);
  });

  socket.on('selection_change', function (data) {
    console.log('selection change event fired---->');
    socket.broadcast.emit('selection_change', data);
  });

  socket.on('change_document', function (data) {
    console.log('change document');
    const editOptions = JSON.parse(data);
    const contentChanges = editOptions.contentChanges[0];

    if (!contentChanges) {
      console.log('editor options---------->', editOptions);
      return;
    }
    let mode = 0;
    const position1 = new Position(contentChanges.range[0].line, contentChanges.range[0].character);
    const position2 = new Position(contentChanges.range[1].line, contentChanges.range[1].character);
    const text = editOptions.contentChanges[0].text;
    if (position1.character !== position2.character || position1.line !== position2.line) {
      mode = 2;
    } else {
      mode = 1;
    }
    console.log('position1', position1);
    console.log('position2', position2);
    console.log('text', text);

    const editResponse = new EditResponse(mode, position1, position2, text);
    console.log('edit response ------>', JSON.stringify(editResponse));
    socket.broadcast.emit('change_document', JSON.stringify(editResponse));
  });

  socket.on('file_system_change', function (data) {
    console.log('file system change event fired----->');
    console.log('file change event', data);
    socket.broadcast.emit('file_system_change', data);
  });

  // setInterval(function () {
  //   const timeNow = Date.now();
  //   console.log('time now ', timeNow);
  //   socket.emit('update_time', timeNow);
  // }, 15000);


  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});