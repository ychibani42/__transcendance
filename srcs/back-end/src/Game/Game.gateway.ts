import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket} from "socket.io";
import { GameService } from "./Game.service";
import { subscribe } from "diagnostics_channel";


@WebSocketGateway({
    cors: {
      origin: "http://localhost:5173",
    },
    namespace : 'game'
})
export class GameGateway{
    constructor(private GameService: GameService){}

    @WebSocketServer()
    server: Server;

    handleConnection(client : Socket){
        console.log("Connection");
        this.GameService.created(client)
        // Mettre User status en GAME
    }

    handleDisconnect(client :Socket){
        console.log("Disconnection");
        // Gerer Deco non voulu
        // Fin de game
        this.GameService.remove(client);
    }

    @SubscribeMessage("JoinQueue")
    JoinQueue(client : Socket, id : number){
        console.log(id)
        this.GameService.JoinQueue(client , id)
    }

    @SubscribeMessage('position')
    positionY(client : Socket,Y : number){
        this.GameService.updateY(Y);
    }
}