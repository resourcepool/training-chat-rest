
function Msg(msg) {
  this.event = 'outbound_msg';
  this.login = msg.login;
  this.uuid = msg.uuid;
  this.message = msg.message;
}

Msg.prototype.broadcastOn = function(socket) {
  socket.broadcast.emit(this.event, {"login": this.login, "uuid": this.uuid, "message": this.message});
};

module.exports = Msg; 