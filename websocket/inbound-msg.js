
function Msg(msg) {
  this.event = 'inbound_msg';
  this.login = msg.login;
  this.uuid = msg.uuid;
  this.message = msg.message;
  this.images = msg.images;
}

Msg.prototype.broadcast = function(sockets) {
  sockets.emit(this.event, {"login": this.login, "uuid": this.uuid, "message": this.message, "images": this.images});
};

Msg.prototype.broadcastOn = function(socket) {
  socket.broadcast.emit(this.event, {"login": this.login, "uuid": this.uuid, "message": this.message, "images": this.images});
};

module.exports = Msg; 