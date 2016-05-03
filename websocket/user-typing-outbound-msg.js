
function Msg(data) {
  this.event = 'user_typing_outbound_msg';
  this.login = data.login;
  this.token = data.token;
}

Msg.parse = function(payload) {
  if (typeof payload != 'object') {
    payload = JSON.parse(payload);
  }
  return new Msg(payload);
};

module.exports = Msg; 