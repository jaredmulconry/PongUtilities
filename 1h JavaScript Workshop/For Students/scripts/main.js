"use strict";

var gameFpsTarget = 120;
var backgroundColor = "gray";
var KEY_W = 87;
var KEY_S = 83;
var KEY_I = 73;
var KEY_K = 75;

var p1x;
var p1y;
var p1color = "red";
var p1direction = 0;
var p2x;
var p2y;
var p2color = "blue";
var p2direction = 0;

var paddleWidth = 16;
var paddleHeight = 64;
var paddleSpeed = 128;

var ballX;
var ballY;
var ballRadius = 8;
var ballSpeed = 32;
var ballColor = "black";
var ballMoveX = 0;
var ballMoveY = 0;
var ball;

function setupGame(width, height)
{
  p1x = 32;
  p1y = height / 2.0;
  p2x = width - 32;
  p2y = height / 2.0;

  ballX = width / 2.0;
  ballY = height / 2.0;

  ballMoveX = Math.random() < 0.5 ? -1 : 1;
  ballMoveY = Math.random() < 0.5 ? -1 : 1;

  ball = new Ball(new Vector(width*0.5, height*0.5),
    "black",
    8);
}

function updateGame(deltaTime, keyboard, width, height)
{
  
  p1direction = 0;
  p2direction = 0;
  if(keyboard.getKey(KEY_W))
  {
    p1direction -= 1;
  }
  if(keyboard.getKey(KEY_S))
  {
    p1direction += 1;
  }
  if(keyboard.getKey(KEY_I))
  {
    p2direction -= 1;
  }
  if(keyboard.getKey(KEY_K))
  {
    p2direction += 1;
  }

  //Player 1
  p1y += p1direction * paddleSpeed * deltaTime;

  var p1collision = checkScreenBounds(p1x, p1y, paddleWidth, paddleHeight, width, height);
  collidePlayer1(resolveCollision(p1x, p1y, p1collision));
  //

  //Player 2
  p2y += p2direction * paddleSpeed * deltaTime;

  var p2collision = checkScreenBounds(p2x, p2y, paddleWidth, paddleHeight, width, height);
  collidePlayer2(resolveCollision(p2x, p2y, p2collision));
  //

  ballX += ballMoveX * ballSpeed * deltaTime;
  ballY += ballMoveY * ballSpeed * deltaTime;

  var ballWallCollision = checkScreenBounds(ballX, ballY, ballRadius*2, ballRadius*2, width, height);
  collideBall(resolveCollision(ballX, ballY, ballWallCollision));

  var ballP1Collision = checkCollision(ballX, ballY, ballRadius*2, ballRadius*2,
                                        p1x, p1y, paddleWidth, paddleHeight);
  collideBall(resolveCollision(ballX, ballY, ballP1Collision));
}

function drawGame(surface, width, height)
{
  fillBackground(surface, width, height, backgroundColor);

  drawBox(surface, p1x, p1y, paddleWidth, paddleHeight, p1color);
  drawBox(surface, p2x, p2y, paddleWidth, paddleHeight, p2color);
  drawCircle(surface, ballX, ballY, ballRadius, ballColor);
}



////////////////////////////////////////////////////
//All of the stuff down here should already work
//Do not Touch!
////////////////////////////////////////////////////

function collidePlayer1(resolutionInfo)
{
  p1x = resolutionInfo.correctedPos.x;
  p1y = resolutionInfo.correctedPos.y;
}
function collidePlayer2(resolutionInfo)
{
  p2x = resolutionInfo.correctedPos.x;
  p2y = resolutionInfo.correctedPos.y;
}
function collideBall(resolutionInfo)
{
  ballX = resolutionInfo.correctedPos.x;
  ballY = resolutionInfo.correctedPos.y;

  if(resolutionInfo.correctionDir.x != 0)
  {
    ballMoveX *= -1;
  }
  else if(resolutionInfo.correctionDir.y != 0)
  {
    ballMoveY *= -1;
  }
}

function resolveCollision(x, y, collisionInfo)
{
  var resolutionInfo = { 
    correctedPos: {x: x, y: y},
    correctionDir: {x: 0, y: 0}
  };
  switch(collisionInfo.dir)
  {
    case HIT_NONE:
      break;
    case HIT_LEFT:
      resolutionInfo.correctedPos.x += collisionInfo.overlap;
      resolutionInfo.correctionDir.x = 1;
    break;
    case HIT_RIGHT:
      resolutionInfo.correctedPos.x -= collisionInfo.overlap;
      resolutionInfo.correctionDir.x = -1;
    break;
    case HIT_UP:
      resolutionInfo.correctedPos.y += collisionInfo.overlap;
      resolutionInfo.correctionDir.y = 1;
    break;
    case HIT_DOWN:
      resolutionInfo.correctedPos.y -= collisionInfo.overlap;
      resolutionInfo.correctionDir.y = -1;
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

  if(box1.l < bounds.l)
  {
    var overlap = bounds.l-box1.l;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_LEFT;
    }
  }
  if(box1.r > bounds.r)
  {
    var overlap = box1.r - bounds.r;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_RIGHT;
    }
  }
  if(box1.u < bounds.u)
  {
    var overlap = bounds.u-box1.u;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_UP;
    }
  }
  if(box1.d > bounds.d)
  {
    var overlap = box1.d - bounds.d;
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

function fillBackground(surface, width, height, color)
{
  surface.fillStyle = color;
  surface.fillRect(0, 0, width, height);
}
function drawBox(surface, x, y, width, height, color)
{
  surface.fillStyle = color;
  surface.fillRect(roundToInt(x - width*0.5), roundToInt(y - height*0.5),
                    width, height);
}
function drawCircle(surface, x, y, radius, color)
{
  surface.beginPath();
  surface.fillStyle = color;
  surface.arc(roundToInt(x), roundToInt(y), radius, 0, 2 * Math.PI);
  surface.fill();
}

var previousFrameTime = Date.now();
function updateDeltaTime()
{
  var currentFrameTime = Date.now();
  var newDT = currentFrameTime - previousFrameTime;
  previousFrameTime = currentFrameTime;
  return newDT * 0.001;
}

var canvas = document.getElementById("GameCanvas");
var context = canvas.getContext("2d");
var gameSize = new Vector();
canvas.addEventListener("onresize", function()
{
  prepareAndRun();
});
var kb = new Keyboard();
function update()
{
  var dt = updateDeltaTime();

  updateGame(dt, kb, gameSize.x, gameSize.y);

  kb.update();
}
function draw()
{
  drawGame(context, gameSize.x, gameSize.y);
}

function prepareAndRun()
{
  gameSize.set(canvas.scrollWidth, canvas.scrollHeight);
  canvas.width = gameSize.x;
  canvas.height = gameSize.y;

  setupGame(gameSize.x, gameSize.y);
  setInterval(update, 1000 / gameFpsTarget);
}


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var vendorLen = vendors.length;
    var x;
    for(x = 0; x < vendorLen && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

window.requestAnimationFrame(prepareAndRun);
function redraw()
{
  draw();
  window.requestAnimationFrame(redraw);
}
window.requestAnimationFrame(redraw);