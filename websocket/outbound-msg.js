
function Msg(data) {
  this.event = 'inbound_msg';
  this.login = data.login;
  this.uuid = data.uuid;
  this.token = data.token;
  this.message = data.message;
}

Msg.parse = function(payload) {
  return new Msg(payload);
};

module.exports = Msg; 