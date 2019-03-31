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
  this.players =[];
  this.max = 9999;
  this.SessionID = Math.floor((Math.random() * this.max) + 1);
  this.receivedSession=0;

  io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(this.SessionID);
    socket.emit('updateScore', {"code":self.SessionID});
    self.players.push(socket.id);
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
  if(getAllPlayers(this).length>1){
    this.buttonConfig=getButtonconfig();
    io.clients[this.players[0]].emit('getScenario',{"command":getCommand(),"buttonA":this.buttonConfig[0],"buttonB":this.buttonConfig[1],"place":getPlace()})
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
  return "0";
}


function getAllPlayers(self){
    return self.players;
}

window.gameLoaded();


