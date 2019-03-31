var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
}

function create() {
  var self = this;
  this.socket = io();
  this.players = this.add.group();

  this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  this.redScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#FF0000' });


  this.socket.on('newPlayer', function (playerInfo) {
    self.players.add(player);
  });

  this.socket.on('disconnect', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  });

  this.socket.on('updateScore', function (sessionid) {
    self.blueScoreText.setText('Session ID: ' + sessionid['code']);
  });

  this.socket.on('receivedSomething', function (sessionid) {
      self.redScoreText.setText('Session ID: ' + sessionid['code']);
    });

  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.cursors.left.isDown) {
    this.socket.emit('codeID',JSON.stringify("12345"))
  }
}