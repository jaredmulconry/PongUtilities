"use strict";
/**
 * @description A 2D vector for positions and directions
 * @param {number} x
 * @param {number} y
 */
var Vector = function(x, y)
{
    this.x = x == undefined ? 0 : x;
    this.y = y == undefined ? 0 : y;

    /**
     * @param {number} x
     * @param {number} y
     */
    this.set = function(x, y)
    {
        this.x = x;
        this.y = y;
    };
    /**
     * @param {number} x
     * @param {number} y
     * @return {Vector}
     */
    this.copy = function()
    {
        return new Vector(this.x, this.y);
    };
    /**
     * @param {Vector} rhs
     */
    this.addTo = function(rhs)
    {
        this.x += rhs.x;
        this.y += rhs.y;
    };
    /**
     * @param {Vector} rhs
     * @return {Vector}
     */
    this.add = function(rhs)
    {
        var res = this.copy();
        res.addTo(rhs);
        return res;
    };
    /**
     * @param {Vector} rhs
     */
    this.subtractFrom = function(rhs)
    {
        this.x -= rhs.x;
        this.y -= rhs.y;
    };
    /**
     * @param {Vector} rhs
     * @return {Vector}
     */
    this.subtract = function(rhs)
    {
        var res = this.copy();
        res.subtractFrom(rhs);
        return res;
    };
    /**
     * @param {number} s
     */
    this.scaleBy = function(s)
    {
        this.x *= s;
        this.y *= s;
    };
    /**
     * @param {number} s
     * @return {Vector}
     */
    this.scale = function(s)
    {
        var res = this.copy();
        res.scaleBy(s);
        return res;
    };
    /**
     * @param {Vector} rhs
     * @return {number}
     */
    this.dot = function(rhs)
    {
        return this.x*this.x + this.y*this.y
    };
    /**
     * @return {number}
     */
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
    /**
     * @description Normalises a copy of this Vector and returns it
     * @return {Vector} Normalised version of this vector
     */
    this.normalized = function()
    {
        var res = this.copy();
        res.normalize();
        return res;
    };
};

/**
 * @param {Vector} pos
 * @param {Vector} size
 */
var Box = function(pos, size)
{
    this.position = pos;
    if(size == undefined)
    {
        throw "You must provide a size for your Box.";
    }
    if(size.x == undefined || size.y == undefined)
    {
        throw "Fix your Box.\n width: " + size.x + "\n height: " + size.y;
    }
    this.size = size;
    this.size.scaleBy(0.5);

    /**
     * @param {Vector} newPos
     */
    this.setPosition = function(newPos)
    {
        this.position.set(newPos);
    };
    this.setSize = function(newSize)
    {
        this.size.set(newSize.scale(0.5));
    };
};

/**
 * @param {Vector} pos
 * @param {number} radius
 */
var Circle = function(pos, radius)
{
    this.position = pos;
    this.radius = radius;

    /**@param {Vector} newPos */
    this.setPosition = function(newPos)
    {
        this.position.set(newPos);
    };
};

/**
 * @param {CollisionShape} shape1
 * @param {CollisionShape} shape2
 * @return {boolean}
 */
function CheckOverlap(shape1, shape2)
{
    if(shape2 == undefined)
    {
        throw "Please provide a second shape.";
    }
    if(shape1 == undefined)
    {
        throw "Please provide shapes to check.";
    }

    var upLeft1 = box1.position.subtract(box1.size);
    var bottomRight2 = box2.position.add(box2.size);
    var bottomRight1 = box1.position.add(box1.size);
    var upLeft2 = box2.position.subtract(box2.size);
    
    if(upLeft1.x > bottomRight2.x && upLeft2.x > bottomRight1.x)
    {
        return false;
    }
    if(upLeft1.y > bottomRight2.y && upLeft2.y > bottomRight1.y)
    {
        return false;
    }

    return true;
}

