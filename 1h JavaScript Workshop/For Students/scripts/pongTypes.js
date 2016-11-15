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
	this.equals = function(other)
	{
		return this.x == other.x && this.y == other.y;
	}

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

Vector.zero = new Vector(0, 0);
Vector.one = new Vector(1, 1);
Vector.up = new Vector(0, -1);
Vector.down = new Vector(0, 1);
Vector.left = new Vector(-1, 0);
Vector.right = new Vector(1, 0);

var Paddle = function(pos, color, up, down)
{
  this.position = pos;
	this.color = color;
	this.direction = 0;
	this.upControl = up;
	this.downControl = down;
	
	this.update = function(deltaTime, keyboard)
	{
		this.direction = 0;
		if(keyboard.getKey(this.upControl))
		{
			this.direction -= 1;
		}
		if(keyboard.getKey(this.downControl))
		{
			this.direction += 1;
		}

  	this.position.y += this.direction * Paddle.speed * deltaTime;
	};

	this.draw = function(surface)
	{
		surface.fillStyle = this.color;
		surface.fillRect(this.position.x - Paddle.halfSize.x, this.position.y - Paddle.halfSize.y, Paddle.size.x, Paddle.size.y);
	};
};

Paddle.size = new Vector(16, 64);
Paddle.halfSize = Paddle.size.scale(0.5);
Paddle.speed = 128;

var Ball = function(pos, color, startSpeed)
{
	this.position = pos;
	this.color = color;
	this.startSpeed = startSpeed;
	this.currentSpeed = this.startSpeed;
	this.direction = new Vector(Math.random(), Math.random()).subtract(new Vector(0.5, 0.5)).scale(2);
	while(this.direction.equals(Vector.zero))
	{
		this.direction.x = (Math.random() - 0.5) * 2;
		this.direction.y = (Math.random() - 0.5) * 2;
	}
	this.direction.normalize();

	this.update = function(deltaTime)
	{
		this.position.addTo(this.direction.scale(this.currentSpeed).scale(deltaTime));
	};
};