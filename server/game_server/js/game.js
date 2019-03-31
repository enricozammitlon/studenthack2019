var players = {};

const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  autoFocus: false
};

var game = new Phaser.Game(config);

function preload (){
}

function create ()
{
  const self=this;
  this.players = this.physics.add.group();
  this.max = 9999;
  this.SessionID = Math.floor((Math.random() * this.max) + 1);

  io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(this.SessionID);
    socket.emit('updateScore', {"code":self.SessionID});
    //this.players.add(player);

  
/*    socket.on('disconnect', function () {
      console.log('user disconnected');
      // remove player from server
      removePlayer(this, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });  */

  });

}

function update (){}

function getSessionID(){
  console.log(this.SessionID);
  return this.SessionID;
}

window.gameLoaded();

