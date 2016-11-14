"use strict;"

var Vector = function()
{
	this.x = 0;
	this.y = 0;

	this.set = function(x, y)
	{
			this.x = x;
			this.y = y;
	};
	this.copy = function()
	{
			return new Vector(this.x, this.y);
	};
	this.addTo = function(rhs)
	{
			this.x += rhs.x;
			this.y += rhs.y;
	};
	this.add = function(rhs)
	{
			var res = this.copy();
			res.addTo(rhs);
			return res;
	};
	this.subtractFrom = function(rhs)
	{
			this.x -= rhs.x;
			this.y -= rhs.y;
	};
	this.subtract = function(rhs)
	{
			var res = this.copy();
			res.subtractFrom(rhs);
			return res;
	};
	this.scaleBy = function(s)
	{
			this.x *= s;
			this.y *= s;
	};
	this.scale = function(s)
	{
			var res = this.copy();
			res.scaleBy(s);
			return res;
	};
	this.dot = function(rhs)
	{
			return this.x*this.x + this.y*this.y
	};
	this.length = function()
	{
			return Math.sqrt(this.dot());
	};
	this.normalize = function()
	{
			var len = this.length();
			if(len == 0.0) throw "This Vector has length 0. normalize won't work.";

			this.x /= len;
			this.y /= len;
	};
	this.normalized = function()
	{
			var res = this.copy();
			res.normalize();
			return res;
	};

	if(arguments.length == 0) return;
  
  if(arguments.length == 1 && arguments[0] instanceof Vector)
  {
    this.x = arguments[0].x;
    this.y = arguments[0].y;
    return;
  }
  
  if(arguments.length == 2 && typeof arguments[0] == Number && typeof arguments[1] == Number)
  {
    this.x = arguments[0];
    this.y = arguments[1];
    return;
  }
};

var Paddle = function(pos, color)
{
  
};

Paddle.size = new Vector(16, 64);