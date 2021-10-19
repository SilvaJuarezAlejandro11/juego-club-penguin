var players = {};
var doubloon = {};

const gameSize = 2500;

const playerSize = 100;
const doubloonSize = 50;
const maxAccel = 10;

function checkCollision(obj1, obj2) {
  return (
    Math.abs(obj1.x - obj2.x) <= playerSize &&
    Math.abs(obj1.y - obj2.y) <= playerSize
  );
}

function isValidPosition(newPosition, playerId) {
  if (newPosition.x < 0 || newPosition.x + playerSize > gameSize) {
    return false;
  }
  if (newPosition.y < 0 || newPosition.y + playerSize > gameSize) {
    return false;
  }
  var hasCollided = false;

  Object.keys(players).forEach((key) => {
    if (key == playerId) {
      return;
    }
    player = players[key];
    if (checkCollision(player, newPosition)) {
      hasCollided = true;
      return;
    }
  });
  if (hasCollided) {
    return false;
  }

  return true;
}

function shuffleDoubloon() {
  var posX = Math.floor(Math.random() * Number(gameSize) - 100) + 10;
  var posY = Math.floor(Math.random() * Number(gameSize) - 100) + 10;

  while (!isValidPosition({ x: posX, y: posY }, '_doubloon')) {
    posX = Math.floor(Math.random() * Number(gameSize) - 100) + 10;
    posY = Math.floor(Math.random() * Number(gameSize) - 100) + 10;
  }

  doubloon.x = posX;
  doubloon.y = posY;
}

function movePlayer(id) {
  var player = players[id];

  var newPosition = {
    x: player.x + player.accel.x,
    y: player.y + player.accel.y,
  };
  if (isValidPosition(newPosition, id)) {
    player.x = newPosition.x;
    player.y = newPosition.y;
  } else {
    player.accel.x = 0;
    player.accel.y = 0;
  }

  if (checkCollision(player, doubloon)) {
    player.score += 1;
    shuffleDoubloon();
  }
}

function accelPlayer(id, x, y) {
  var player = players[id];
  var currentX = player.accel.x;
  var currentY = player.accel.y;

  if (x > 0) {
    player.direction = 'right';
  } else if (x < 0) {
    player.direction = 'left';
  } else if (y > 0) {
    player.direction = 'down';
  } else if (y < 0) {
    player.direction = 'up';
  }

  if (Math.abs(currentX + x) < maxAccel) {
    player.accel.x += x;
  }
  if (Math.abs(currentY + y) < maxAccel) {
    player.accel.y += y;
  }
}

function stringToColour(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

if (!this.navigator) {
  module.exports = {
    players: players,
    stringToColour: stringToColour,
    accelPlayer: accelPlayer,
    movePlayer: movePlayer,
    playerSize: playerSize,
    gameSize: gameSize,
    isValidPosition: isValidPosition,
    doubloon: doubloon,
    shuffleDoubloon: shuffleDoubloon,
  };
}
