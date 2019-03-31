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
  this.playerList=[];
  this.players =[];
  this.microbits=[];
  this.max = 9999;

  io.on('connection', function (socket) {
    console.log('a user connected');
    self.playerList.push(socket.id);
    var SessionID = Math.floor((Math.random() * self.max) + 1);
    self.games[SessionID]=0;
    socket.join(SessionID);
    socket.emit('hostCode', {"code":SessionID});
    self.players[socket.id]=SessionID;
    console.log("New Game Room: "+self.players[socket.id]+" hosted by "+socket.id);

    socket.on('joinGame', function (sessionid) {
        console.log(socket.id+" is joingin game room: "+sessionid);
        socket.leave(self.players[socket.id]);
        socket.join(sessionid);
        self.players[socket.id]=sessionid;
        });

    socket.on('startgame', function (start) {
            console.log("game room: "+sessionid+" is starting.");
            self.games[io.sockets.manager.roomClients[socket.id]]=1;
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
    if(self.games[0]){
      this.buttonConfig=getButtonconfig();
      //io.to(`${self.players[0]}`).emit('getScenario',{"command":getCommand(),"buttonA":this.buttonConfig[0],"buttonB":this.buttonConfig[1],"place":getPlace()})
      io.to(self.playerList[0]).emit('getScenario',{"command":getCommand(1),"buttonA":this.buttonConfig[0],"buttonB":this.buttonConfig[1],"place":getPlace()})
      io.to(self.playerList[1]).emit('getScenario',{"command":getCommand(2),"buttonA":this.buttonConfig[0],"buttonB":this.buttonConfig[1],"place":getPlace()})

    }
  //});
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function getSessionID(){
  console.log(SessionID);
  return SessionID;
}

function getCommand(i){
  if(i==1){
    return "Poop your pants";    
  }
  else if(i==2){
    return "Soil your pants";    
  }
}

function getButtonconfig(){
  return ["Punch","Kick"];
}

function getPlace(){
  return "0";
}


function getAllGameSessions(self){
    return self.games;
}

window.gameLoaded();


