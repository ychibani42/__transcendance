import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket} from "socket.io";

import { StateService } from "./state.service";

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
	},
	namespace: 'state',
})
export class StateGateway {
	constructor(private stateservice : StateService) {
    }

	@WebSocketServer()
	server: Server;


    @SubscribeMessage('Connect')
    Connect(client :Socket, id  : number){
        console.log("connection",id)
        return this.stateservice.connection(client,id)
    }

    handleDisconnect(client :Socket){
        this.stateservice.disconnect(client)
    }

    @SubscribeMessage('game')
    Gameconnection(client :Socket){
        return this.stateservice.Game(client)
    }

    @SubscribeMessage('Change')
    Change(client :Socket){
        this.stateservice.Change(client)
    }

    @SubscribeMessage('Invite')
    Invite(client :Socket,id : number){
        this.stateservice.invite(client,id)
    }

    @SubscribeMessage('Accepted')
    Accepte(client :Socket,id : number){
        console.log("Yes",id)
        this.stateservice.accept(client,id)
    }

    @SubscribeMessage('Refused')
    Refused(client :Socket,id : number){
        console.log("no",id)
        this.stateservice.refused(client,id)
    }
}