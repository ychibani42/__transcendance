import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket} from "socket.io";
import { GameService } from "./Game.service";

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

    handleDisconnect(client :Socket){
        console.log("DISCONNECT GAME",client.id)
        this.GameService.remove(client);
    }

    @SubscribeMessage("JoinQueue")
    JoinQueue(client : Socket, id : number){
        this.GameService.JoinQueue(client , id)
    }

    @SubscribeMessage('LeaveQueue')
    LeaveQueue(client : Socket , id: number){
        return this.GameService.LeaveQueue(client,id)
    }

    @SubscribeMessage('position')
    positionY(client : Socket,Y : pos){
        this.GameService.updateY(Y[0],Y[1] , client);
    }

    @SubscribeMessage('ready')
    ready(client : Socket , name : string){
        this.GameService.ReadyGame(client,name)
    }

    @SubscribeMessage('Config')
    config(client : Socket , arg: any){
        console.log("Config",client.id)
        this.GameService.ConfigGame(client,arg[0],arg[1])
    }

    @SubscribeMessage('Invite')
    Createroom(client : Socket , arg: any){
        console.log("Invite GAME",client.id)
        this.GameService.invited(client,arg)
        return true
    }

    @SubscribeMessage('Join')
    Joinroom(client : Socket , arg: any){
        console.log("Join",client.id)
        this.GameService.acceptINV(client,arg)
    }

    @SubscribeMessage('Delete')
    Deleteroom(client : Socket , arg: any){
        console.log("Delete",client.id)
        return this.GameService.deleteroom(client,arg)
    }

    @SubscribeMessage("LeaveGame")
    Leavegame(client : Socket)
    {
        console.log("LEaveGame",client.id)
        this.GameService.leavegame(client);
    }
}
