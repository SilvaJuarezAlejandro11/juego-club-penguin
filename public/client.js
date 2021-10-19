$(function () {
  var socket = io();
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var img = '../pinguinos/amarillo.jgp';

  var localDirection;

  socket.on('gameStateUpdate', updateGameState);

  function drawPlayers(players) {
    Object.keys(players).forEach((playerId) => {
      let player = players[playerId];
      var direction;

      ctx.fillStyle = player.colour;
      ctx.fillRect(player.x / 5, player.y / 5, playerSize / 5, playerSize / 5);

      if (playerId == socket.id) {
        direction = localDirection;
      } else {
        direction = player.direction;
      }

      ctx.fillStyle = 'black';
      let accelWidth = 3;
      switch (direction) {
        case 'up':
          ctx.fillRect(
            player.x / 5,
            player.y / 5 - accelWidth,
            playerSize / 5,
            accelWidth
          );
          break;
        case 'down':
          ctx.fillRect(
            player.x / 5,
            player.y / 5 + playerSize / 5,
            playerSize / 5,
            accelWidth
          );
          break;
        case 'left':
          ctx.fillRect(
            player.x / 5 - accelWidth,
            player.y / 5,
            accelWidth,
            playerSize / 5
          );
          break;
        case 'right':
          ctx.fillRect(
            player.x / 5 + playerSize / 5,
            player.y / 5,
            accelWidth,
            playerSize / 5
          );
      }
    });
  }

  function updateGameState(gameState) {
    players = gameState.players;
    doubloon = gameState.doubloon;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var playerCount = Object.keys(players).length;
    document.getElementById('playerCount').innerHTML =
      'Hay ' +
      String(playerCount) +
      ' pinguino' +
      (playerCount > 1 ? 's' : '') +
      ' en la pista de hielo!';
    var scores = '';
    Object.values(players)
      .sort((a, b) => b.score - a.score)
      .forEach((player, index) => {
        scores +=
          "<p><span style='border-bottom: 1px solid " +
          player.colour +
          ";'>" +
          player.name +
          '</span> Ha atrapado ' +
          player.score +
          ' pescado' +
          (player.score === 1 ? '' : 's') +
          '! </p>';
      });
    document.getElementById('scores').innerHTML = scores;

    ctx.beginPath();
    ctx.arc(
      (doubloon.x + doubloonSize / 2) / 5,
      (doubloon.y + doubloonSize / 2) / 5,
      doubloonSize / 5,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = 'gray';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#003300';
    ctx.stroke();

    drawPlayers(players);
  }

  $('html').keydown(function (e) {
    if (e.key == 'ArrowDown') {
      socket.emit('down', players);
      accelPlayer(socket.id, 0, 1);
      localDirection = 'down';
    } else if (e.key == 'ArrowUp') {
      socket.emit('up', players);
      accelPlayer(socket.id, 0, -1);
      localDirection = 'up';
    } else if (e.key == 'ArrowLeft') {
      socket.emit('left', players);
      accelPlayer(socket.id, -1, 0);
      localDirection = 'left';
    } else if (e.key == 'ArrowRight') {
      socket.emit('right', players);
      accelPlayer(socket.id, 1, 0);
      localDirection = 'right';
    }
  });

  function gameLoop() {
    updateGameState({ players: players, doubloon: doubloon });
    Object.keys(players).forEach((playerId) => {
      let player = players[playerId];
      movePlayer(playerId);
    });
  }

  function drawGame() {
    drawPlayers(players);
    requestAnimationFrame(drawGame);
  }

  setInterval(gameLoop, 25);
  requestAnimationFrame(drawGame);
});
