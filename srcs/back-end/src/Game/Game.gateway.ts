import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket} from "socket.io";
import { GameService } from "./Game.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/Guard/jwt-guard";

interface pos {
    y : number,
    name : string
}

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
	},
	namespace: 'game',
})

export class GameGateway {
	constructor(private GameService: GameService) {}

	@WebSocketServer()
	server: Server;

    @UseGuards(JwtAuthGuard)
    handleConnection(){
    }

    handleDisconnect(client :Socket){
        this.GameService.remove(client);
    }

    @SubscribeMessage("JoinQueue")
    JoinQueue(client : Socket, id : number){
        this.GameService.JoinQueue(client , id)
    }

    @SubscribeMessage('position')
    positionY(client : Socket,Y : pos){
        this.GameService.updateY(Y[0],Y[1] , client);
    }

    @SubscribeMessage('ready')
    ready(client : Socket , name : string){
        this.GameService.ReadyGame(client,name)
    }
}
