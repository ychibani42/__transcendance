import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable({})
export class GameService {
	constructor(

    ) {}
    private readonly Queue : Socket[] = [];
    
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
}
