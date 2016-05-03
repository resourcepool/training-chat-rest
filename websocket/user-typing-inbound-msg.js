
function Msg(login) {
  this.event = 'user_typing_inbound_msg';
  this.login = login;
}

Msg.prototype.broadcast = function(sockets) {
  sockets.emit(this.event, {"login": this.login});
};

Msg.prototype.broadcastOn = function(socket) {
  socket.broadcast.emit(this.event, {"login": this.login});
};

module.exports = Msg; 