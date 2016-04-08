
function Msg(payload) {
  this.event = 'auth_attempt';
  this.login = payload.login;
  this.password = payload.password;
}

Msg.parse = function(payload) {
  return new Msg(payload);
};

module.exports = Msg; 