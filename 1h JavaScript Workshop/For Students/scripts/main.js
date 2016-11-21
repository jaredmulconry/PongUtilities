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
var gameRestarting = false;

function setupGame(width, height)
{
  player1 = new Paddle(new Vector(32, height / 2.0), "red", KEY_W, KEY_S);
  player2 = new Paddle(new Vector(width - 32, height / 2.0), "blue", KEY_I, KEY_K);
  ball = new Ball(new Vector(width*0.5, height*0.5),
    "black",
    8);
    arenaWalls = new ScreenBounds(new Vector(width, height));
}

function updateGame(deltaTime, keyboard, width, height)
{
  //Player 1
  player1.update(deltaTime, keyboard);
  //

  //Player 2
  player2.update(deltaTime, keyboard);
  //

  ball.update(deltaTime);
}

function drawGame(surface, width, height)
{
  fillBackground(surface, width, height, backgroundColor);

  player1.draw(surface);
  player2.draw(surface);
  ball.draw(surface);
}



////////////////////////////////////////////////////
//All of the stuff down here should already work
//Do not Touch!
////////////////////////////////////////////////////



function fillBackground(surface, width, height, color)
{
  surface.fillStyle = color;
  surface.fillRect(0, 0, width, height);
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
  if(gameRestarting)
  {
    gameRestarting = false;
  }
  else
  {
    updateRequest = window.requestAnimationFrame(update);
  }
}
function draw()
{
  drawGame(context, gameSize.x, gameSize.y);
}

function prepare()
{
  gameSize.set(canvas.scrollWidth, canvas.scrollHeight);
  canvas.width = gameSize.x;
  canvas.height = gameSize.y;

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