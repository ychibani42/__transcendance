import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Interval } from "@nestjs/schedule";

@Injectable({})
export class GameService {
	constructor(

    ) {}
    private readonly Queue : Socket[] = [];
    private Game : any;


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
        this.Game = setInterval(this.sendball,10,client);
    }

    sendball(client : Socket){
        console.log("BALL");
        client.emit("ball");
    }

    stoploop(){
        console.log("BIG BALL");
        clearInterval(this.Game);
    }
}
