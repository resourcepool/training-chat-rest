
function Msg(login, token) {
  this.event = 'auth_success';
  this.data = {"login": login, "token": token, "message": 'Client connection to Chat Service successful.'};
}

Msg.prototype.emitOn = function(socket) {
  socket.emit(this.event, this.data);
};

module.exports = Msg; 