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
  this.receivedSession=0;
  this.lastPlayderID = 0;

  io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(this.SessionID);
    socket.emit('updateScore', {"code":self.SessionID});
    socket.on('newplayer',function(){
      socket.player = {
          id: self.lastPlayderID++
      };
      socket.emit('allplayers',getAllPlayers());
      socket.broadcast.emit('newplayer',socket.player);
    });
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
    socket.on('codeID', function (sessionid) {
        console.log(sessionid);
        self.receivedSession=sessionid;
        });
  });

}

function update (){
  this.physics.world.wrap(this.players, 5);
  io.emit('receivedSomething', {"code":this.receivedSession});

  if(getAllPlayers().length>1){
    self.buttonConfig=getButtonconfig();
    io.emit('getScenario',{"command":getCommand(),"buttonA":self.buttonConfig[0],"buttonB":self.buttonConfig[1],"place":getPlace()})
  }
}

function getSessionID(){
  console.log(this.SessionID);
  return this.SessionID;
}

function getCommand(){
  return "Poop your pants";
}

function getButtonconfig(){
  return ["Punch","Kick"];
}

function getPlace(){
  return "1";
}

function addPlayer(self,socket) {
  self.players.a
}

function removePlayer(self, playerId) {

}

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

window.gameLoaded();


