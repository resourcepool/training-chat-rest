
function Msg() {
  this.event = 'auth_failed';
  this.data = 'Client connection to Chat Service failed. Please check your credentials';
}

Msg.emitOn = function(socket) {
  var msg = new Msg();
  socket.emit(msg.event, msg.data);
};

module.exports = Msg; 