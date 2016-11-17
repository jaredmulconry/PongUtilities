"use strict";

function roundToInt(v)
{
  return ~~(0.5 + v);
}

var Paddle = function(pos, color, up, down)
{
  this.position = pos;
	this.color = color;
	this.direction = 0;
	this.upControl = up;
	this.downControl = down;
};

Paddle.prototype.handleCollision = function(col)
{
  this.position.set(col.position);
};

Paddle.prototype.update = function(deltaTime, keyboard)
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

Paddle.prototype.draw = function(surface)
{
  surface.fillStyle = this.color;
  surface.fillRect(
    roundToInt(this.position.x - Paddle.halfSize.x), 
    roundToInt(this.position.y - Paddle.halfSize.y),
    Paddle.size.x, Paddle.size.y);
};

Paddle.size = new Vector(16, 64);
Paddle.halfSize = Paddle.size.scale(0.5);
Paddle.speed = 128;

var Ball = function(pos, color)
{
	this.position = pos;
	this.color = color;
	this.currentSpeed = this.startSpeed;
	this.direction = new Vector(Math.random(), Math.random()).subtract(new Vector(0.5, 0.5)).scale(2);
	while(this.direction.equals(Vector.zero))
	{
		this.direction.x = (Math.random() - 0.5) * 2;
		this.direction.y = (Math.random() - 0.5) * 2;
	}
	this.direction.normalize();
};

Ball.startSpeed = 64;
Ball.size = new Vector(16, 16);
Ball.halfSize = Ball.size.scale(0.5);

Ball.prototype.handleCollision = function(col)
{
  this.position = col.position;

  if(col.direction.x != 0)
  {
    this.direction.x *= -1;
  }
  else if(col.direction.y != 0)
  {
    this.direction.y *= -1;
  }
};

Ball.prototype.update = function(deltaTime)
{
  this.position.addTo(this.direction.scale(this.currentSpeed).scale(deltaTime));
};

Ball.prototype.draw = function(surface)
{
  surface.fillStyle = this.color;
  surface.fillRect(
    roundToInt(this.position.x - Ball.halfSize.x), 
    roundToInt(this.position.y - Ball.halfSize.y),
    Ball.size.x,
    Ball.size.y);
};