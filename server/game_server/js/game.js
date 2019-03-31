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
  this.start=false;
  this.required='A';
  this.place=0;

  io.on('connection', function (socket) {
    console.log('a user connected');
    self.playerList.push(socket.id);
    var SessionID = Math.floor((Math.random() * self.max) + 1);
    self.games[SessionID]=false;
    socket.join(SessionID);
    socket.emit('hostCode', {"code":SessionID});
    self.players[socket.id]=SessionID;
    console.log("New Game Room: "+self.players[socket.id]+" hosted by "+socket.id);

    socket.on('joinGame', function (sessionid) {
        console.log(socket.id+" is joining game room: "+sessionid);
        socket.leave(self.players[socket.id]);
        socket.join(sessionid);
        self.players[socket.id]=sessionid;
        });

    socket.on('response', function (pressed) {
        if(pressed='A'){
          self.place+=1;
        }
        else{
          self.place-=-1;
        }

        });

    socket.on('endgame', function (pressed) {
        self.start=false;

        });

    socket.on('startgame', function (start) {
            console.log("game room: "+self.players[socket.id]+" is starting.");
            self.start=true;
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
    if(self.start){
      this.buttonConfig=getButtonconfig();
      //io.to(`${self.players[0]}`).emit('getScenario',{"command":getCommand(),"buttonA":this.buttonConfig[0],"buttonB":this.buttonConfig[1],"place":getPlace()})
      io.to(self.playerList[0]).emit('getScenario',{"command":getCommand(1,self),"buttonA":this.buttonConfig[0],"buttonB":this.buttonConfig[1],"place":getPlace(self)})
      io.to(self.playerList[1]).emit('getScenario',{"command":getCommand(2,self),"buttonA":this.buttonConfig[2],"buttonB":this.buttonConfig[3],"place":getPlace(self)})

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

function getCommand(i,self){
  if(i==1){
    self.required='A';
    return "Bite";    
  }
  else if(i==2){
    self.required='B';
    return "Punch";    
  }
}

function getButtonconfig(){
  return ["Punch","Kick","Bite","Piss"];
}

function getPlace(self){
  return self.place;
}


function getAllGameSessions(self){
    return self.games;
}

window.gameLoaded();


