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

var BoxConstraint = AABB;

var AABBIntersection = function(dir, overlap)
{
  this.direction = dir;
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

function resolveCollision(position, collisionInfo)
{
  var resolutionInfo = arguments[2] instanceof ResolutionInfo
    ? arguments[2]
    : new ResolutionInfo();

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

function checkCollision(obj1, obj2)
{
  var collisionResults;
  if(arguments[2] != undefined && arguments[2] instanceof CollisionInfo)
  {
    collisionResults = arguments[2];
    collisionResults.intersections.splice(0, collisionResults.intersections.length);
    collisionResults.other = obj2;
  }
  else
  {
    collisionResults = new CollisionInfo(obj2);
  }
  return calculateMinOverlap(obj1.bounds, obj2.bounds, collisionResults);
}

function checkScreenBounds(obj, bounds)
{
  var collisionResults = new CollisionInfo(bounds);
  return calculateInverseMinOverlap(obj.bounds, bounds.bounds, collisionResults);
}

function calculateInverseMinOverlap(box1, bounds)
{
  var currentHit;
  if(arguments[2] instanceof CollisionInfo)
  {
    currentHit = arguments[2];
  }
  else if(arguments[2] != undefined && typeof arguments[2] == "object")
  {
    currentHit = new CollisionInfo(arguments[2]);
  }
  else
  {
    currentHit = new CollisionInfo(undefined);
  }

  if(box1.l < bounds.l)
  {
    currentHit.addIntersection(new AABBIntersection(HIT_LEFT, bounds.l-box1.l));
  }
  if(box1.r > bounds.r)
  {
    currentHit.addIntersection(new AABBIntersection(HIT_RIGHT, box1.r - bounds.r));
  }
  if(box1.u < bounds.u)
  {
    currentHit.addIntersection(new AABBIntersection(HIT_UP, bounds.u-box1.u));
  }
  if(box1.d > bounds.d)
  {
    currentHit.addIntersection(new AABBIntersection(HIT_DOWN, box1.d - bounds.d));
  }

  return currentHit;
}

function calculateMinOverlap(box1, box2)
{
  var currentHit;
  if(arguments[3] instanceof CollisionInfo)
  {
    currentHit = arguments[3];
  }
  else if(arguments[3] != undefined && typeof arguments[3] == "object")
  {
    currentHit = new CollisionInfo(arguments[3]);
  }
  else
  {
    currentHit = new CollisionInfo(null);
  }

  if((((box1.l - box2.r) < 0 && (box1.l - box2.l) > 0) || ((box1.r - box2.l) > 0 && (box1.r - box2.r) < 0)) && (((box1.d - box2.u) > 0 && (box1.d - box2.d) < 0) || ((box1.u - box2.d) < 0 && (box1.u - box2.u) > 0)))
  {
    if(box2.r-box1.l > 0)
    {
      currentHit.addIntersection(new AABBIntersection(HIT_LEFT, box2.r-box1.l));
    }
    if(box1.r - box2.l > 0)
    {
      currentHit.addIntersection(new AABBIntersection(HIT_RIGHT, box1.r - box2.l));
    }
    if(box2.d-box1.u > 0)
    {
      currentHit.addIntersection(new AABBIntersection(HIT_UP, box2.d-box1.u));
    }
    if(box1.d - box2.u > 0)
    {
      currentHit.addIntersection(new AABBIntersection(HIT_DOWN, box1.d - box2.u));
    }
  }

  return currentHit;
}