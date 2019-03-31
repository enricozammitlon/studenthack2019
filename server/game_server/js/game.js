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
  this.games =[];
  this.players =[];
  this.microbits=[];
  this.max = 9999;

  io.on('connection', function (socket) {
    console.log('a user connected');
    var SessionID = Math.floor((Math.random() * self.max) + 1);
    self.games.push(SessionID);
    socket.join(SessionID);
    socket.in(SessionID).emit('hostCode', {"code":""+SessionID});
    self.players[socket.id]=SessionID;
    console.log("New Game Room: "+self.players[socket.id]+" hosted by "+socket.id);

    socket.on('joinGame', function (sessionid) {
        console.log(socket.id+" is joingin game room: "+sessionid);
        socket.leave(self.players[socket.id]);
        socket.join(sessionid);
        self.players[socket.id]=sessionid;
        });

    socket.on('disconnect', function () {
      console.log('user '+socket.id +' disconnected from game room '+self.players[socket.id]);
      // remove player from server
      socket.leave(self.players[socket.id]);
      // remove this player from our players object
      delete self.players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

  });

}

function update (){
  this.physics.world.wrap(this.players, 5);
  const self= this;
  //getAllPlayers(this).forEach((player) => {
    //if(getAllPlayers(self).length>1){
      this.buttonConfig=getButtonconfig();
      //io.to(`${self.players[0]}`).emit('getScenario',{"command":getCommand(),"buttonA":this.buttonConfig[0],"buttonB":this.buttonConfig[1],"place":getPlace()})
      io.emit('getScenario',{"command":getCommand(),"buttonA":this.buttonConfig[0],"buttonB":this.buttonConfig[1],"place":getPlace()})
    //}
  //});
}

function getSessionID(){
  console.log(SessionID);
  return SessionID;
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

function getAllGameSessions(self){
    return self.games;
}

window.gameLoaded();


