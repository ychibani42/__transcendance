import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { SchedulerRegistry } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";


enum state{
    onroom,
    ready,
    play,
    finish
}

interface  ball{
    x : number,
    y :number,
    r : number,
    speed :number,
    velX : number,
    velY : number,
}

interface player{
    x : number,
    y :number,
    w : number,
    h : number,
    score : number,
    socket : Socket,
    id : number
}

interface Room{
    state : state,
    name : string,
    ball : ball,
    play : player,
    play2 : player,
    ready : boolean,
    ready2 : boolean
}

@Injectable({})
export class GameService {
	constructor(
        private schedulerRegistry: SchedulerRegistry,
        private prismaService: PrismaService,
    ) {}
    Queue : Array<Socket> = [];
    Rooms : Array<Room> = [];
    Matchmacking: Array<player> = [];
    
    //ROOM GESTION


    created(socket : Socket) {
        this.Queue.push(socket)
    }

    JoinQueue(client : Socket, id : number){
        let newplay : player
        newplay = {
            x : 0,
            y : 0,
            w : 8,
            h : 37,
            score : 0,
            socket : client,
            id : id
        }
        for (let index = 0; index < this.Matchmacking.length; index++) {
            if(newplay.id === this.Matchmacking[index].id)
                return
        }
        this.Matchmacking.push(newplay)
        client.emit("onQueue")
        console.log(this.Matchmacking.length)
        while(this.Matchmacking.length >= 2){
            this.createroom(this.Matchmacking.shift(),this.Matchmacking.shift())
        }
    }

    async createroom(play : player|undefined , play2 : player|undefined){
        play?.socket.emit("onQueue")
        play2?.socket.emit("onQueue")
        let id = play?.id
        if(play){
            const user = await this.prismaService.user.findUniqueOrThrow({where : {id : id}})
            if(user.name && play && play2){
                const room : Room = {
                    state : state.onroom,
                    name : user.name,
                    ball : {
                        x : 150,
                        y : 5,
                        r : 5,
                        speed :2,
                        velX : 2,
                        velY : 2,
                    },
                    play : play,
                    play2 : play2,
                    ready : false,
                    ready2 : false
                }
                if(this.Rooms.length == 0)
                    this.addInterval()
                room.play.x = 15
                room.play2.x = 300 - 15 - 8
                room.play2.socket.emit("playerdef",1,room.name)
                room.play.socket.emit("playerdef",0,room.name)
                this.Rooms.push(room)
            }
        }
    }

    ReadyGame(client : Socket , name : string){
        this.Rooms.forEach(element => {
            if(element.name == name){
                if (element.play.socket == client)
                    element.ready = true
                if (element.play2.socket == client)
                    element.ready2 = true
                if(element.ready == true && element.ready2 == true)
                {
                    element.state = state.play
                }
            }
        })
    }




    //GAME CALCUL
    rungame(GameService : GameService)
    {
        try {
            GameService.Rooms.forEach((element) => {
                if(element.state == state.play)
                {
                    GameService.calcball(element)
                    element.play.socket.emit("pos",element.play2.y,element.ball.x,element.ball.y)
                    element.play2.socket.emit("pos",element.play.y,element.ball.x,element.ball.y)
                }
                if(element.state == state.onroom)
                {
                    element.play2.socket.emit("OnRoom")
                    element.play.socket.emit("OnRoom")
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateY(pos : number , name : string , client : Socket){
        this.Rooms.forEach(element => {
            if(element.name == name){
                if (element.play.socket == client)
                {
                    element.play.y = pos
                }
                if (element.play2.socket == client)
                {
                    element.play2.y = pos
                }
            }
        })
    }

    colition(bal : ball, play : player){
        var ballc = {
            top:0,
            bot:0,
            l:0,
            r:0,
        };
        var playC ={
            top:0,
            bot:0,
            l:0,
            r:0,
        };
        ballc.top = bal.y - bal.r;
        ballc.bot = bal.y + bal.r;
        ballc.l = bal.x - bal.r;
        ballc.r = bal.x + bal.r;
        
        playC.top = play.y;
        playC.bot = play.y + play.h;
        playC.l = play.x;
        playC.r = play.x + play.w;
    
        return playC.l < ballc.r && playC.top < ballc.bot && playC.r > ballc.l && playC.bot > ballc.top;
    }


    calcball(room : Room){
        let ball = room.ball
        ball.x += ball.velX;
        ball.y += ball.velY;
        if(ball.y + ball.r > 150){
            ball.y = 150 - ball.r
            ball.velY = -ball.velY
        }
        if(ball.y - ball.r < 0){
            ball.y = 0 + ball.r
            ball.velY = -ball.velY
        }
        let player = (ball.x < 300/2) ? room.play : room.play2;
        if(this.colition(ball,player))
        {
            let colpoint = ball.y - (player.y + 37/2);
            colpoint = colpoint/(player.h/2);
            let anglered = colpoint * Math.PI/4;

            let dir = (ball.x < 300/2) ? 1 : -1;
            ball.velX = dir * ball.speed * Math.cos(anglered);
            ball.velY = ball.speed * Math.sin(anglered);
            if(ball.speed < 7)
                ball.speed += 0.2;
        }
        if(ball.x + ball.r > 300){
            room.play.score++
            this.resetball(room)
            room.play2.socket.emit("score",room.play.score,room.play2.score)
            room.play.socket.emit("score",room.play.score,room.play2.score)
        }
        if(ball.x - ball.r < 0){
            room.play2.score++
            this.resetball(room)
            room.play2.socket.emit("score",room.play.score,room.play2.score)
            room.play.socket.emit("score",room.play.score,room.play2.score)
        }
        room.ball = ball
        if(room.play.score == 5)
        {
            room.state = state.finish
            room.play.socket.emit("finish", "Winner")
            room.play2.socket.emit("finish","Looser")
        }
        if(room.play2.score == 5)
        {
            room.state = state.finish
            room.play2.socket.emit("finish", "Winner")
            room.play.socket.emit("finish","Looser")
        }
    }

    resetball(room : Room)
    {
        room.ball.x = 150
        room.ball.y = 75
        room.ball.speed = 2
        room.ball.velX = 2 * ((room.ball.velX > 0) ? 1 : -1)
    }

    remove(socket : Socket){
        let id : number;
        this.Rooms.forEach((element) => {
            if(element.play.socket == socket || element.play2.socket == socket)
            {
                element.state = state.finish
                id = this.Rooms.indexOf(element)
                this.Rooms.splice(id,1)
                this.stoploop()
            }
        })
    }

    //INTERVAL GESTION 

    stoploop(){
        console.log("STOP INTERVAL",this.Rooms.length)
        if(this.Rooms.length != 0)
            return
        console.log("END INTERVAL");
        try {
            this.schedulerRegistry.deleteInterval("game")
        } catch (error) {
            console.log("ERROR WITH SCH REG",error)
        }
    }

    addInterval() {
        const interval = setInterval(this.rungame,15,this);
        this.schedulerRegistry.addInterval("game", interval);
    }
}
