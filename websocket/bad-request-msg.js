
function Msg(reason) {
  this.event = 'bad_request';
  this.data = reason ? reason : 'Request is malformed. Please check API docs.';
}

Msg.prototype.emitOn = function(socket) {
  socket.emit(this.event, this.data);
};

module.exports = Msg; 