"use strict";

var backgroundColor = "gray";
var KEY_W = 87;
var KEY_S = 83;
var KEY_I = 73;
var KEY_K = 75;

var player1;
var player2;
var ball;
var arenaWalls;

function CollideBallWithWalls(width, height)
{
  var ballWallCollide = checkBounds(ball.collider, arenaWalls)
  if(ballWallCollide.isColliding())
  {
    ball.handleCollision(resolveCollision(ball.position, ballWallCollide.getMinIntersection()));

    var wallLose = ballWallCollide.intersections.find(
          function(x)
          {
            return x.direction == HIT_LEFT || x.direction == HIT_RIGHT;
          });
    if(wallLose != undefined)
    {
      //A player has won
      if(wallLose == HIT_RIGHT)
      {
        //Player 1 has won
        setupGame(width, height);
      }
      else
      {
        //Player 2 has won
        setupGame(width, height);
      }

      return true;
    }
  }
  return false;
}
function CollideWithWalls(width, height)
{
  //Collide things with walls
  var p1WallCollide = checkBounds(player1.collider, arenaWalls);
  var p2WallCollide = checkBounds(player2.collider, arenaWalls);
  if(CollideBallWithWalls(width, height))
  {
    return;
  }

  if(p1WallCollide.isColliding())
  {
    player1.handleCollision(resolveCollision(player1.position, p1WallCollide.getMinIntersection()));
  }
  if(p2WallCollide.isColliding())
  {
    player2.handleCollision(resolveCollision(player2.position, p2WallCollide.getMinIntersection()));
  }
}

function CollideBallWithPaddles(width, height)
{
  //Collide the ball with paddles
  var ballP1Collide = checkCollision(ball, player1);
  var ballP2Collide = checkCollision(ball, player2);
  if(ballP1Collide.isColliding())
  {
    ball.handleCollision(resolveCollision(ball.position, ballP1Collide.getMinIntersection()));
    ball.direction.scaleBy(1.5);
  }
  if(ballP2Collide.isColliding())
  {
    ball.handleCollision(resolveCollision(ball.position, ballP2Collide.getMinIntersection()));
    ball.direction.scaleBy(1.5);
  }
}

function setupGame(width, height)
{
  player1 = new Paddle(new Vector(32, height / 2.0), "red", KEY_W, KEY_S);
  player2 = new Paddle(new Vector(width - 32, height / 2.0), "blue", KEY_I, KEY_K);
  ball = new Ball(new Vector(width*0.5, height*0.5),
    "black",
    8);
    arenaWalls = new ScreenBounds(new Vector(width, height));

    fillBackground(width, height, backgroundColor);
}

function updateGame(deltaTime, keyboard, width, height)
{
  //Move things
  player1.update(deltaTime, keyboard);
  player2.update(deltaTime, keyboard);
  ball.update(deltaTime);

  CollideWithWalls(width, height);
  CollideBallWithPaddles(width, height);
}

function drawGame(surface, width, height)
{
  clearSurface(surface, width, height);

  player1.draw(surface);
  player2.draw(surface);
  ball.draw(surface);
}

////////////////////////////////////////////////////
//All of the stuff down here should already work
//Do not Touch!
////////////////////////////////////////////////////

function clearSurface(surface, width, height)
{
  surface.clearRect(0, 0, width, height);
}

function fillBackground(width, height, color)
{
  clearSurface(backgroundContext, width, height);
  backgroundContext.clearRect(0, 0, width, height);
  backgroundContext.fillStyle = color;
  backgroundContext.fillRect(0, 0, width, height);
}

var previousFrameTime = Date.now();
function updateDeltaTime()
{
  var currentFrameTime = Date.now();
  var newDT = currentFrameTime - previousFrameTime;
  previousFrameTime = currentFrameTime;
  return newDT * 0.001;
}

var gameCanvas = document.getElementById("GameCanvas");
var gameContext = gameCanvas.getContext("2d");
var backgroundCanvas = document.getElementById("BackgroundCanvas");
var backgroundContext = backgroundCanvas.getContext("2d");
var gameSize = new Vector();
gameCanvas.addEventListener("onresize", function()
{
  prepare();
});

var updateRequest;
var drawRequest;
var kb = new Keyboard();
function update()
{
  var dt = updateDeltaTime();

  updateGame(dt, kb, gameSize.x, gameSize.y);

  kb.update();
  updateRequest = window.requestAnimationFrame(update);
}
function draw()
{
  drawGame(gameContext, gameSize.x, gameSize.y);
}

function prepare()
{
  gameSize.set(gameCanvas.scrollWidth, gameCanvas.scrollHeight);
  gameCanvas.width = gameSize.x;
  gameCanvas.height = gameSize.y;
  backgroundCanvas.width = gameSize.x;
  backgroundCanvas.height = gameSize.y;

  setupGame(gameSize.x, gameSize.y);
}

function prepareAndRun()
{
  prepare();
  updateRequest = window.requestAnimationFrame(update);
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