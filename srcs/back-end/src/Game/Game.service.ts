import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Interval } from "@nestjs/schedule";

@Injectable({})
export class GameService {
	constructor(

    ) {}
    Queue : Array<Socket> = [];
    Game : any;


    created(socket : Socket) {
        this.Queue.push(socket);
        console.log("ONE CON",socket.id);
    }

    findall() : Socket[]{
        return this.Queue
    }

    remove(socket : Socket){
        const id = this.Queue.indexOf(socket);
        const remove = this.Queue.splice(id,1);
        console.log("ONE DIS",socket.id);
    }

    lunchloop(client : Socket){
        console.log("ddw")
        if(this.Queue.length == 1)
            this.Game = setInterval(this.sendball,1000,this.Queue);
    }

    sendball(clients : Socket[])
    {
        console.log(clients)
        console.log("here")
    }

    stoploop(){
        if(this.Queue.length != 0)
            return
        console.log("BIG BALLs");
        clearInterval(this.Game);
    }
}
