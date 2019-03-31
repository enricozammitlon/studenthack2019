var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1000,
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
  this.redScoreText = this.add.text(16, 30, '', { fontSize: '32px', fill: '#FF0000' });
  this.greenScoreText = this.add.text(584, 16, 'Users connected:', { fontSize: '32px', fill: '#00FF00' });

  this.blueScoreText1 = this.add.text(16, 50, '', { fontSize: '32px', fill: '#0000FF' });
  this.redScoreText1 = this.add.text(16,70, '', { fontSize: '32px', fill: '#FF0000' });
  this.greenScoreText1 = this.add.text(584, 90, '', { fontSize: '32px', fill: '#00FF00' });

   this.socket.on('disconnect', function (playerId) {
    self.players.getChildren().forEach(function (player) {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  });

  this.socket.on('hostCode', function (sessionid) {
    self.blueScoreText.setText('Session ID: ' + sessionid['code']);
  });

  this.socket.on('getScenario', function (scenario) {
    self.blueScoreText1.setText('Command: ' + scenario['command']);
    self.redScoreText1.setText('Button A: ' + scenario['buttonA']);
    self.greenScoreText1.setText('Button B: ' + scenario['buttonB']);

  });

  this.socket.on('receivedSomething', function (sessionid) {
      self.redScoreText.setText('Received Session ID: ' + sessionid['code']);
    });

  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.cursors.left.isDown) {
    this.socket.emit('startgame',"y")
  }
}