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

//Converts a collision event into the information needed to
//resolve it.
function resolveCollision(position, collisionInfo)
{
  var resolutionInfo = arguments[2] instanceof ResolutionInfo
    ? arguments[2]
    : new ResolutionInfo();

  resolutionInfo.position.set(position);
  resolutionInfo.direction.set(Vector.zero);
  resolutionInfo.collision = collisionInfo;

  switch(collisionInfo.direction)
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

//Checks whether two objects have collided and provides information for each intersection.
//NOTE: Currently only provides information to resolve obj1.
function checkCollision(obj1, obj2)
{
  var collisionResults;
  if(arguments[2] != undefined && arguments[2] instanceof CollisionInfo)
  {
    collisionResults = arguments[2];
    collisionResults.other = obj2;
  }
  else
  {
    collisionResults = new CollisionInfo(obj2);
  }
  return calculateIntersections(obj1.collider.bounds, obj2.collider.bounds, collisionResults);
}

//Checks whether an object has collided with a bounding region and provides information for each intersection.
function checkBounds(collider, bounds)
{
  var collisionResults;
  if(arguments[2] != undefined && arguments[2] instanceof CollisionInfo)
  {
    collisionResults = arguments[2];
    collisionResults.other = bounds;
  }
  else
  {
    collisionResults = new CollisionInfo(bounds);
  }
  return calculateInverseIntersections(collider.bounds, bounds.collider.bounds, collisionResults);
}

//Calculates whether a collider has left the provided bounding region and provides information for each intersection.
function calculateInverseIntersections(col, bounds)
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

  if(col.l < bounds.l)
  {
    currentHit.addIntersection(new AABBIntersection(HIT_LEFT, bounds.l-col.l));
  }
  if(col.r > bounds.r)
  {
    currentHit.addIntersection(new AABBIntersection(HIT_RIGHT, col.r - bounds.r));
  }
  if(col.u < bounds.u)
  {
    currentHit.addIntersection(new AABBIntersection(HIT_UP, bounds.u-col.u));
  }
  if(col.d > bounds.d)
  {
    currentHit.addIntersection(new AABBIntersection(HIT_DOWN, col.d - bounds.d));
  }

  return currentHit;
}

//Calculates whether two colliders have collided and provides information for each intersection.
function calculateIntersections(box1, box2)
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

  //This checks to see if a collision has occurred between two boxes
  //if((leftIntersect || rightIntersect) && (topIntersect || bottomIntersect))
  if((((box1.l - box2.r) < 0 && (box1.l - box2.l) > 0) || ((box1.r - box2.l) > 0 && (box1.r - box2.r) < 0)) && (((box1.d - box2.u) > 0 && (box1.d - box2.d) < 0) || ((box1.u - box2.d) < 0 && (box1.u - box2.u) > 0)))
  {
    //Each check below determines whether some of the intersection occurred
    //on a given side of box1.
    if(box2.r-box1.l > 0 && box2.r-box1.l <= box1.r-box1.l)
    {
      currentHit.addIntersection(new AABBIntersection(HIT_LEFT, box2.r-box1.l));
    }
    if(box1.r-box2.l > 0 && box1.r-box2.l <= box1.r-box1.l)
    {
      currentHit.addIntersection(new AABBIntersection(HIT_RIGHT, box1.r - box2.l));
    }
    if(box2.d-box1.u > 0 && box2.d-box1.u <= box1.d-box1.u)
    {
      currentHit.addIntersection(new AABBIntersection(HIT_UP, box2.d-box1.u));
    }
    if(box1.d-box2.u > 0 && box1.d-box2.u <= box1.d-box1.u)
    {
      currentHit.addIntersection(new AABBIntersection(HIT_DOWN, box1.d - box2.u));
    }
  }

  return currentHit;
}