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
  this.collider = new AABB(Paddle.size);
  this.collider.setPosition(this.position);
};

Paddle.prototype.handleCollision = function(col)
{
  this.position.set(col.position);
  this.collider.setPosition(this.position);
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
  this.collider.setPosition(this.position);
  this.collider.updateBounds();
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
	this.currentSpeed = Ball.startSpeed;
  this.collider = new AABB(Ball.size);
	this.direction = new Vector(Math.random(), Math.random()).subtract(new Vector(0.5, 0.5)).scale(2);
	while(this.direction.equals(Vector.zero))
	{
		this.direction.x = (Math.random() - 0.5) * 2;
		this.direction.y = (Math.random() - 0.5) * 2;
	}
	this.direction.normalize();
  this.collider.setPosition(this.position);
  this.collider.updateBounds();
};

Ball.startSpeed = 64;
Ball.radius = 8;
Ball.halfSize = new Vector(Ball.radius, Ball.radius);
Ball.size = Ball.halfSize.scale(2);


Ball.prototype.handleCollision = function(col)
{
  this.position.set(col.position);
  this.collider.setPosition(this.position);
  this.collider.updateBounds();

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
  this.collider.setPosition(this.position);
  this.collider.updateBounds();
};

Ball.prototype.draw = function(surface)
{
  surface.fillStyle = this.color;
  surface.beginPath();
  surface.arc(
    roundToInt(this.position.x), 
    roundToInt(this.position.y),
    Ball.radius,
    0,
    2 * Math.PI);
  surface.fill();
};

var ScreenBounds = function(size)
{
  this.size = new Vector(size);
  this.position = this.size.scale(0.5);
  this.collider = new BoxConstraint(this.size);
  this.collider.setPosition(this.position);
};

ScreenBounds.prototype.setSize = function(pos)
{
  this.size.set(pos);
  this.position.set(this.size.scale(0.5));
  this.collider.setPosition(this.position);
  this.collider.setSize(this.size);
  this.collider.updateBounds();
};