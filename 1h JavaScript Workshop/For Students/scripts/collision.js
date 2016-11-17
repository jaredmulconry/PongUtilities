"use strict";

var HIT_NONE = 0;
var HIT_LEFT = 1;
var HIT_RIGHT = 2;
var HIT_UP = 3;
var HIT_DOWN = 4;

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
  this.position = pos;
  this.direction = dir;
  this.collision = col;
};