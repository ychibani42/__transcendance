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
}

@Injectable({})
export class GameService {
	constructor(
        private schedulerRegistry: SchedulerRegistry,
        private prismaService: PrismaService,
    ) {}
    Queue : Array<Socket> = [];
    Rooms : Array<Room> = [];
    private ball = {} as ball
    private play2 = {} as player
    private play = {} as player

    Matchmacking: Array<player> = [];
    
    //ROOM GESTION


    created(socket : Socket) {
        this.Queue.push(socket)

            this.ball.x = 150
            this.ball.y = 5
            this.ball.r = 5
            this.ball.speed = 2
            this.ball.velX = 2
            this.ball.velY = 2
            this.play2.x = 300 - 15 - 8
            this.play2.y = 0
            this.play2.w = 8
            this.play2.h = 37
            this.play2.score = 0
            this.play.score = 0
            this.play.x = 15
            this.play.y = 150/2
            this.play.w = 8
            this.play.h = 37
        if(this.Queue[0])
        {
            this.Queue[0].emit("update")
        }
        if(this.Queue.length > 1)
        {
            this.Queue.forEach((element,index) => {
                if(index != 0)
                    element.emit('spectate')
            })
        }
    }

    JoinQueue(client : Socket, id : number){
        let newplay : player
        newplay = {
            x : 0,
            y : 0,
            w : 0,
            h : 0,
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
        if(this.Matchmacking.length >= 2){
            this.createroom(this.Matchmacking.shift(),this.Matchmacking.shift())
        }
        console.log("Room",this.Rooms.length)
        if(this.Rooms[0])
            console.log("Room",this.Rooms[0])
    }

    async createroom(play : player|undefined , play2 : player|undefined){
        console.log(play?.id)
        console.log(play2?.id)
        play?.socket.emit("onQueue")
        play2?.socket.emit("onQueue")
        let id = play?.id 
        const user = await this.prismaService.user.findUniqueOrThrow({where : {id : id}})
        if(user.name && play && play2){
            const room : Room = {
                state : 1,
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
                play2 : play2
            }
            if(this.Rooms.length == 0)
                this.addInterval()
            this.Rooms.push(room)
            console.log("Room here",this.Rooms.length)
        }
    }




    //GAME CALCUL
    updateY(pos : number){
        this.play.y = pos
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


    calcball(){
        let playerlel = 0.1;
        this.play2.y = this.play2.y + (this.ball.y - (this.play2.y + this.play2.h/2)) * playerlel;
        this.ball.x += this.ball.velX;
        this.ball.y += this.ball.velY;
        if(this.ball.y + this.ball.r > 150){
            this.ball.y = 150 - this.ball.r
            this.ball.velY = -this.ball.velY
        }
        if(this.ball.y - this.ball.r < 0){
            this.ball.y = 0 + this.ball.r
            this.ball.velY = -this.ball.velY
        }
        let player = (this.ball.x < 300/2) ? this.play : this.play2;
        if(this.colition(this.ball,player))
        {
            let colpoint = this.ball.y - (player.y + 37/2);
            colpoint = colpoint/(player.h/2);
            let anglered = colpoint * Math.PI/4;

            let dir = (this.ball.x < 300/2) ? 1 : -1;
            this.ball.velX = dir * this.ball.speed * Math.cos(anglered);
            this.ball.velY = this.ball.speed * Math.sin(anglered);
            if(this.ball.speed < 7)
                this.ball.speed += 0.2;
        }
        if(this.ball.x + this.ball.r > 300){
            this.play.score++
            this.resetball()
        }
        if(this.ball.x - this.ball.r < 0){
            this.play2.score++
            this.resetball()
        }
    }
    resetball()
    {
        this.ball.x = 150
        this.ball.y = 75
        this.ball.speed = 2
        this.ball.velX = 2 * ((this.ball.velX > 0) ? 1 : -1)
    }

    findall() : Socket[]{
        return this.Queue
    }

    remove(socket : Socket){
        let id : number;
        this.Rooms.forEach((element) => {
            if(element.play.socket == socket || element.play2.socket == socket)
            {
                element.state = 3
                id = this.Rooms.indexOf(element)
                this.Rooms.splice(id,1)
                this.stoploop()
            }
        })
    }

    rungame(GameService : GameService)
    {
        try {
            GameService.Rooms.forEach((element) => (console.log(element.name)))
        } catch (error) {
            console.log(error);
        }
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
