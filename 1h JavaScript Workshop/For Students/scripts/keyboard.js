
var KEY_UP = 0;
var KEY_DOWN = 1;

var Keyboard = function()
{
  this.keyState = [];
  this.prevKeyState = [];

  this.internal_GetKeyState = function(k)
  {
    if(this.keyState[k] == undefined)
    {
      this.keyState[k] = KEY_UP;
    }
    return this.keyState[k];
  };
  this.internal_getPrevKeyState = function(k)
  {
    if(this.prevKeyState[k] == undefined)
    {
      this.prevKeyState[k] = KEY_UP;
    }
    return this.prevKeyState[k];
  };
  this.getKey = function(k)
  {
    return this.internal_GetKeyState(k) == KEY_DOWN;
  };
  this.getKeyDown = function(k)
  {
    var current = this.internal_GetKeyState(k);
    var prev = this.internal_getPrevKeyState(k);
    return current != prev && current == KEY_DOWN;
  };
  this.getKeyUp = function(k)
  {
    var current = this.internal_GetKeyState(k);
    var prev = this.internal_getPrevKeyState(k);
    return current != prev && current == KEY_UP;
  };
  this.update = function()
  {
    for(var i = 0; i < this.keyState.length; ++i)
    {
      this.prevKeyState[i] = this.internal_GetKeyState(i);
    }
  };

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