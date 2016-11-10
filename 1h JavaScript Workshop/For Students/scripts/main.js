"use strict;"

var fpsTarget = 75;
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
}

function updateGame(deltaTime, keyboard, width, height)
{
  //Player 1
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

  p1y += p1direction * paddleSpeed * deltaTime;

  var p1collision = checkScreenBounds(p1x, p1y, paddleWidth, paddleHeight, width, height);
  fixPlayer1(resolveCollision(p1x, p1y, p1collision));
  //

  //Player 2
  if(keyboard.getKey(KEY_I))
  {
    p2direction -= 1;
  }
  if(keyboard.getKey(KEY_K))
  {
    p2direction += 1;
  }

  p2y += p2direction * paddleSpeed * deltaTime;

  var p2collision = checkScreenBounds(p2x, p2y, paddleWidth, paddleHeight, width, height);
  fixPlayer2(resolveCollision(p2x, p2y, p2collision));
  //

  ballX += ballMoveX * ballSpeed * deltaTime;
  ballY += ballMoveY * ballSpeed * deltaTime;

  var ballWallCollision = checkScreenBounds(ballX, ballY, ballRadius*2, ballRadius*2, width, height);
  
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

var HIT_NONE = 0;
var HIT_LEFT = 1;
var HIT_RIGHT = 2;
var HIT_UP = 3;
var HIT_DOWN = 4;

function fixPlayer1(resolutionInfo)
{
  p1x = resolutionInfo.correctedPos.x;
  p1y = resolutionInfo.correctedPos.y;
}
function fixPlayer2(resolutionInfo)
{
  p2x = resolutionInfo.correctedPos.x;
  p2y = resolutionInfo.correctedPos.y;
}
function fixBall(resolutionInfo)
{

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
  var hw1 = w1 / 2.0;
  var hw2 = w2 / 2.0;
  var hh1 = h1 / 2.0;
  var hh2 = h2 / 2.0;

  var left1 = x1 - hw1;
  var right1 = x1 + hw1;
  var up1 = y1 - hh1;
  var down1 = y1 + hh1;
  var left2 = x2 - hw2;
  var right2 = x2 + hw2;
  var up2 = y2 - hh2;
  var down2 = y2 + hh2;

  return calculateMinOverlap({l: left1, r: right1, u: up1, d: down1}, 
                              {l: left2, r: right2, u: up2, d: down2});
}

function checkScreenBounds(x, y, w, h, sw, sh)
{
  var hw = w / 2.0;
  var hh = h / 2.0;

  var left = x - hw;
  var right = x + hw;
  var up = y - hh;
  var down = y + hh;

  return calculateMinOverlap({l: left, r: right, u: up, d: down},
                              {l: sw, r: 0, u: sh, d: 0});
}

function calculateMinOverlap(box1, box2)
{
  var currentHit = { dir: HIT_NONE, overlap: Number.MAX_VALUE };

  if(box1.l < box2.r)
  {
    var overlap = box2.r-box1.l;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_LEFT;
    }
  }
  if(box1.r > box2.l)
  {
    var overlap = box1.r - box2.l;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_RIGHT;
    }
  }
  if(box1.u < box2.d)
  {
    var overlap = box2.d-box1.u;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_UP;
    }
  }
  if(box1.d > box2.u)
  {
    var overlap = box1.d - box2.u;
    if(overlap < currentHit.overlap)
    {
      currentHit.overlap = overlap;
      currentHit.dir = HIT_DOWN;
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
  surface.fillRect(Math.round(x - width/2.0), Math.round(y - height/2.0),
                    width, height);
}
function drawCircle(surface, x, y, radius, color)
{
  surface.beginPath();
  surface.fillStyle = color;
  surface.arc(Math.round(x), Math.round(y), radius, 0, 2 * Math.PI);
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
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;
var kb = new Keyboard();
function run()
{
  var dt = updateDeltaTime();

  updateGame(dt, kb, canvas.width, canvas.height);
  drawGame(context, canvas.width, canvas.height);

  kb.update();
}

setupGame(canvas.width, canvas.height);

(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / fpsTarget);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();
window.onEachFrame(run);