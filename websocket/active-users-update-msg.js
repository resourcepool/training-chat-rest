function Msg(users) {
  this.event = 'active_users_update';
  this.users = users;
}

Msg.prototype.broadcastOn = function (socket) {
  socket.broadcast.emit(this.event, {"users": this.users});
  socket.emit(this.event, {"users": this.users});
};

module.exports = Msg; 