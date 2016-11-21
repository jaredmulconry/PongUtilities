"use strict";

var HIT_NONE = 0;
var HIT_LEFT = 1;
var HIT_RIGHT = 2;
var HIT_UP = 3;
var HIT_DOWN = 4;

var AABB = function(size)
{
  this.position = new Vector(Vector.zero);
  this.size = new Vector(size);
  this.halfSize = this.size.scale(0.5);
  this.bounds = {l:-this.halfSize.x, r:this.halfSize.x,
                u:-this.halfSize.y, d:this.halfSize.y };
};
AABB.prototype.setPosition = function(pos)
{
  this.position.set(pos);
};
AABB.prototype.setSize = function(size)
{
  this.size.set(size);
  this.halfSize.set(this.size.scale(0.5));
};
AABB.prototype.updateBounds = function()
{
  this.bounds.l = this.position.x - this.halfSize.x;
  this.bounds.r = this.position.x + this.halfSize.x;
  this.bounds.u = this.position.y - this.halfSize.y;
  this.bounds.d = this.position.y + this.halfSize.y;
};

var AABBIntersection = function(dir, overlap)
{
  this.direction = new Vector(dir);
  this.overlap = overlap;
};

var CollisionInfo = function(other)
{
  this.intersections = [];
  this.other = other;
};

CollisionInfo.prototype.isColliding = function()
{
  return this.intersections.length != 0;
};

CollisionInfo.prototype.addIntersection = function(intersection)
{
  var insertPos = this.intersections.findIndex(
    function(x)
    {
      return x.overlap < intersection.overlap;
    });
  
  this.intersections.splice(insertPos, 0, intersection);
};

CollisionInfo.prototype.getMinIntersection = function()
{
  return this.intersections[0];
};

var ResolutionInfo = function(pos, dir, col)
{
  this.position = new Vector(pos);
  this.direction = new Vector(dir);
  this.collision = col;
};

var BoxConstraint = AABB;

function resolveCollision(position, collisionInfo)
{
  var resolutionInfo = arguments[2] instanceof ResolutionInfo
    ? arguments[2]
    : new ResolutionInfo(position, Vector.zero, collisionInfo);

  resolutionInfo.position.set(position);
  resolutionInfo.direction.set(Vector.zero);
  resolutionInfo.collision = collisionInfo;

  switch(collisionInfo.dir)
  {
    case HIT_NONE:
      break;
    case HIT_LEFT:
      resolutionInfo.position.x += collisionInfo.overlap;
      resolutionInfo.direction.x = 1;
    break;
    case HIT_RIGHT:
      resolutionInfo.position.x -= collisionInfo.overlap;
      resolutionInfo.direction.x = -1;
    break;
    case HIT_UP:
      resolutionInfo.position.y += collisionInfo.overlap;
      resolutionInfo.direction.y = 1;
    break;
    case HIT_DOWN:
      resolutionInfo.position.y -= collisionInfo.overlap;
      resolutionInfo.direction.y = -1;
    break;
  }

  return resolutionInfo;
}

function checkCollision(x1, y1, w1, h1,
                        x2, y2, w2, h2)
{
  var hw1 = w1 * 0.5;
  var hw2 = w2 * 0.5;
  var hh1 = h1 * 0.5;
  var hh2 = h2 * 0.5;

  return calculateMinOverlap(
    {l: x1 - hw1, r: x1 + hw1, u: y1 - hh1, d: y1 + hh1}, 
    {l: x2 - hw2, r: x2 + hw2, u: y2 - hh2, d: y2 + hh2});
}

function checkScreenBounds(x, y, w, h, sw, sh)
{
  var hw = w * 0.5;
  var hh = h * 0.5;

  return calculateInverseMinOverlap(
    {l: x - hw, r: x + hw, u: y - hh, d: y + hh},
    {l: 0, r: sw, u: 0, d: sh});
}

function calculateInverseMinOverlap(box1, bounds)
{
  var currentHit = { dir: HIT_NONE, overlap: Number.MAX_VALUE };
  var overlap;

  if(box1.l < bounds.l)
  {
    overlap = bounds.l-box1.l;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_LEFT;
    }
  }
  if(box1.r > bounds.r)
  {
    overlap = box1.r - bounds.r;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_RIGHT;
    }
  }
  if(box1.u < bounds.u)
  {
    overlap = bounds.u-box1.u;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_UP;
    }
  }
  if(box1.d > bounds.d)
  {
    overlap = box1.d - bounds.d;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_DOWN;
    }
  }

  return currentHit;
}

function calculateMinOverlap(box1, box2)
{
  var currentHit = { dir: HIT_NONE, overlap: Number.MAX_VALUE };

  var leftIntersect = (box1.l - box2.r) < 0 && (box1.l - box2.l) > 0;
  var rightIntersect = (box1.r - box2.l) > 0 && (box1.r - box2.r) < 0;
  var topIntersect = (box1.u - box2.d) < 0 && (box1.u - box2.u) > 0;
  var bottomIntersect = (box1.d - box2.u) > 0 && (box1.d - box2.d) < 0;

  if((leftIntersect && (bottomIntersect || topIntersect)) || (rightIntersect && (bottomIntersect || topIntersect)))
  {
    {
      var overlap = box2.r-box1.l;
      if(overlap < currentHit.overlap)
      {
        currentHit.overlap = overlap;
        currentHit.dir = HIT_LEFT;
      }
    }
    {
      var overlap = box1.r - box2.l;
      if(overlap < currentHit.overlap)
      {
        currentHit.overlap = overlap;
        currentHit.dir = HIT_RIGHT;
      }
    }
    {
      var overlap = box2.d-box1.u;
      if(overlap < currentHit.overlap)
      {
        currentHit.overlap = overlap;
        currentHit.dir = HIT_UP;
      }
    }
    {
      var overlap = box1.d - box2.u;
      if(overlap < currentHit.overlap)
      {
        currentHit.overlap = overlap;
        currentHit.dir = HIT_DOWN;
      }
    }
  }

  return currentHit;
}