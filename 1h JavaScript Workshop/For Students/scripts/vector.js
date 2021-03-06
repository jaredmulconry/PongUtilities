"use strict";

var Vector = function()
{
	this.x = 0;
	this.y = 0;

	if(arguments.length == 0) return;
  
  if(arguments.length == 1 && arguments[0] instanceof Vector)
  {
    this.x = arguments[0].x;
    this.y = arguments[0].y;
    return;
  }
  
  if(arguments.length == 2 && typeof arguments[0] === "number" && typeof arguments[1] === "number")
  {
    this.x = arguments[0];
    this.y = arguments[1];
    return;
  }
};

Vector.prototype.set = function()
{
  if(arguments.length == 1 && arguments[0] instanceof Vector)
  {
    this.x = arguments[0].x;
    this.y = arguments[0].y;
  }
  else if(arguments.length == 2 && typeof arguments[0] == "number" && typeof arguments[1] == "number")
  {
    this.x = arguments[0];
    this.y = arguments[1];
  }
};
Vector.prototype.copy = function()
{
  return new Vector(this.x, this.y);
};
Vector.prototype.addTo = function(rhs)
{
  this.x = rhs.x + this.x;
  this.y = rhs.y + this.y;
};
Vector.prototype.add = function(rhs)
{
  var res = this.copy();
  res.addTo(rhs);
  return res;
};
Vector.prototype.subtractFrom = function(rhs)
{
  this.x = rhs.x - this.x;
  this.y = rhs.y - this.y;
};
Vector.prototype.subtract = function(rhs)
{
  var res = this.copy();
  res.subtractFrom(rhs);
  return res;
};
Vector.prototype.scaleBy = function(s)
{
  this.x = s * this.x;
  this.y = s * this.y;
};
Vector.prototype.scale = function(s)
{
  var res = this.copy();
  res.scaleBy(s);
  return res;
};
Vector.prototype.dot = function(rhs)
{
  return this.x*this.x + this.y*this.y
};
Vector.prototype.length = function()
{
  return Math.sqrt(this.dot());
};
Vector.prototype.normalize = function()
{
  var len = this.length();
  if(len == 0.0) throw "This Vector has length 0. normalize won't work.";

  this.x = this.x / len;
  this.y = this.y / len;
};
Vector.prototype.normalized = function()
{
  var res = this.copy();
  res.normalize();
  return res;
};
Vector.prototype.equals = function(other)
{
  return this.x == other.x && this.y == other.y;
}

Vector.zero = new Vector(0, 0);
Vector.one = new Vector(1, 1);
Vector.up = new Vector(0, -1);
Vector.down = new Vector(0, 1);
Vector.left = new Vector(-1, 0);
Vector.right = new Vector(1, 0);