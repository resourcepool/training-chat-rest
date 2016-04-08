
function Msg(data) {
  this.event = 'active_users_request_msg';
  this.login = data.login;
  this.token = data.token;
}

Msg.parse = function(payload) {
  return new Msg(payload);
};

module.exports = Msg; 