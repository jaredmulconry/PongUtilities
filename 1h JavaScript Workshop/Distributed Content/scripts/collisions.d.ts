
declare class Vector
{
  x: number;
  y: number;

  constructor(x?:number, y?:number);

  set(x:number, y:number):void;
  copy():Vector;
  addTo(rhs:Vector):void;
  add(rhs:Vector):Vector;
  subtractFrom(rhs:Vector):void;
  subtract(rhs:Vector):Vector;
  scaleBy(s:number):void;
  scale(s:number):Vector;
  dot(rhs:Vector):number;
  length():number;
  normalize():void;
  normalized():Vector;
}

declare interface CollisionShape
{
  position: Vector;
}

declare class Box implements CollisionShape
{
  position: Vector;
  size: Vector;

  constructor(pos:Vector, size:Vector);

  setPosition(newPos:Vector):void;
  setSize(newSize:Vector):void;
}

declare class Circle implements CollisionShape
{
  position: Vector;
  radius: number;

  setPosition(newPos:Vector):void;
  setRadius(newRadius:number):void;
}

declare function CheckOverlap(shape1:CollisionShape, shape2:CollisionShape) : boolean;