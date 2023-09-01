import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Interval , SchedulerRegistry } from "@nestjs/schedule";


interface  ball{
    x : number,
    y :number,
    r : number,
    speed :number,
    velX : number,
    velY : number,
}

interface com{
    x : number,
    y :number,
    w : number,
    h : number,
}

@Injectable({})
export class GameService {
	constructor(
        private schedulerRegistry: SchedulerRegistry,
    ) {}
    Queue : Array<Socket> = [];
    Game : any;
    private ball = {} as ball
    private com = {} as com
    private play = {} as com
    
    created(socket : Socket) {
        this.Queue.push(socket);
        this.Game = 'LOL'
        this.ball.x = 150
        this.ball.y = 5
        this.ball.r = 5
        this.ball.speed = 2
        this.ball.velX = 2
        this.ball.velY = 2
        this.com.x = 300 - 15
        this.com.y = 0
        this.com.w = 8
        this.com.h = 37
        this.play.x = 15
        this.play.y = 0
        this.play.w = 8
        this.play.h = 37
    }

    updateY(pos : number){
        this.play.y = pos
    }

    colition(bal : ball, play : com){
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
        if(this.ball.x + this.ball.r > 300){
            this.ball.x = 300 - this.ball.r
            this.ball.velX = -this.ball.velX
        }
        if(this.ball.x - this.ball.r < 0){
            this.ball.x = 0 + this.ball.r
            this.ball.velX = -this.ball.velX
        }
        let comlel = 0.1;
        this.com.y = this.com.y + (this.ball.y - (this.com.y + this.com.h/2)) * comlel;
        if(this.colition(this.ball,this.com))
        {
            let colpoint = this.ball.y - (this.com.y + this.com.h/2);
            colpoint = colpoint/(this.com.h/2);
            let anglered = colpoint * (Math.PI/4);

            let dir = (this.ball.x < 300/2) ? 1 : -1;
            this.ball.velX = dir * this.ball.speed * Math.cos(anglered);
            this.ball.velY = this.ball.speed * Math.sin(anglered);
            if(this.ball.speed < 10)
                this.ball.speed += 0.2;
        }
    }

    findall() : Socket[]{
        return this.Queue
    }

    remove(socket : Socket){
        const id = this.Queue.indexOf(socket);
        const remove = this.Queue.splice(id,1);
        console.log("ONE DIS",socket.id);
    }

    sendball(Queue : Socket[],GameService : GameService)
    {
        try {
            console.log(Queue.length);
            GameService.calcball();
            Queue.forEach((element) => element.emit('com',GameService.com.y))
            Queue.forEach((element) => element.emit('ball', GameService.ball.x , GameService.ball.y))
        } catch (error) {
            console.log(error);
        }
    }

    stoploop(){
        if(this.Queue.length != 0)
            return
        console.log("BIG BALL");
        
        try {
            this.schedulerRegistry.deleteInterval("game")
        } catch (error) {
        }
    }

    addInterval(queue : Socket[]) {
        const interval = setInterval(this.sendball,15,queue,this);
        this.schedulerRegistry.addInterval("game", interval);
    }
}
