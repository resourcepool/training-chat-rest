
function Msg(payload) {
  this.event = 'outbound_msg';
  this.login = data.login;
  this.uuid = data.uuid;
  this.token = data.token;
  this.message = data.message;
}

Msg.parse = function(payload) {
  if (typeof payload != 'object') {
    payload = JSON.parse(payload);
  }
  return new Msg(payload);
};

module.exports = Msg; 