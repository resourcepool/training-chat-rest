
function Msg() {
  this.event = 'auth_required';
  this.data = 'Authentication required. Please enter credentials.';
}

Msg.emitOn = function(socket) {
  var msg = new Msg();
  socket.emit(msg.event, msg.data);
};

module.exports = Msg; 