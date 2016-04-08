
function Msg(uuid) {
  this.event = 'post_success_msg';
  this.uuid = uuid;
}

Msg.prototype.emitOn = function(socket) {
  socket.emit(this.event, {"uuid": this.uuid});
};

module.exports = Msg; 