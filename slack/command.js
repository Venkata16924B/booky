var request = require('request');

var Command = function(matcher, handler) {
  this.matcher = matcher;
  this.handler = handler;
  this._isDefault = false;
};

Command.prototype.setHelp = function(command, text) {
  this.help = {
    command: command,
    text: text
  };
};

Command.prototype.run = function(slack, context) {
  return this.handler(slack, context, this);
};

Command.prototype.getHelp = function() {
  return this.help;
};

Command.prototype.setDefault = function(isDefault) {
  this._isDefault = isDefault;
};

Command.prototype.isDefault = function() {
  return this._isDefault;
};

Command.prototype.matches = function(command) {
  if (this.matcher instanceof RegExp) {
    return this.matcher.test(command);
  } else if (this.matcher instanceof Function) {
    return this.matcher(command);
  } else {
    return this.matcher === command;
  }
};

Command.prototype.buildResponse = function(text, response_type, attachments) {
  var json = {
    text: text
  }

  if (response_type) {
    json.response_type = response_type;
  }

  if (attachments) {
    json.attachments = attachments;
  }

  return json;
};

Command.prototype.reply = function(url, text, response_type, attachments) {
  var options = {
    url: url,
    method: 'POST',
    json: this.buildResponse(text, response_type, attachments)
  };

  return new Promise((resolve, reject) => { 
    request(options, (error, res, body) => { 
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
};

module.exports = Command;
