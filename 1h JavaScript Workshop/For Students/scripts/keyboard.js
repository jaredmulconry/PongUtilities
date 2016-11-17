"use strict";

var KEY_UP = 0;
var KEY_DOWN = 1;

var Keyboard = function()
{
  this.keyState = [];
  this.prevKeyState = [];

  var self = this;
  document.addEventListener("keydown", function(e)
  {
    self.keyState[e.keyCode] = KEY_DOWN;
  });
  document.addEventListener("keyup", function(e)
  {
    self.keyState[e.keyCode] = KEY_UP;
  });
};

Keyboard.prototype.internal_convertKeyState = function(state)
{
  return state == undefined ? KEY_UP : state;
};

Keyboard.prototype.internal_GetKeyState = function(k)
{
  return this.internal_convertKeyState(this.keyState[k]);
};
Keyboard.prototype.internal_getPrevKeyState = function(k)
{
  return this.internal_convertKeyState(this.prevKeyState[k]);
};
Keyboard.prototype.getKey = function(k)
{
  return this.internal_GetKeyState(k) == KEY_DOWN;
};
Keyboard.prototype.getKeyDown = function(k)
{
  var current = this.internal_GetKeyState(k);
  var prev = this.internal_getPrevKeyState(k);
  return current != prev && current == KEY_DOWN;
};
Keyboard.prototype.getKeyUp = function(k)
{
  var current = this.internal_GetKeyState(k);
  var prev = this.internal_getPrevKeyState(k);
  return current != prev && current == KEY_UP;
};
Keyboard.prototype.update = function()
{
  var i;
  var stateLen = this.keyState.length;
  for(i = 0; i < stateLen; ++i)
  {
    this.prevKeyState[i] = this.keyState[i];
  }
};