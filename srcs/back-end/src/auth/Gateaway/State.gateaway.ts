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
    async Connect(client :Socket, id  : number){
        await this.stateservice.connection(client,id)
    }

    async handleDisconnect(client :Socket){
        await this.stateservice.disconnect(client)
    }

    @SubscribeMessage('game')
    Gameconnection(client :Socket){
        this.stateservice.Game(client)
    }

    @SubscribeMessage('Change')
    Change(client :Socket){
        this.stateservice.Change(client)
    }

    @SubscribeMessage('Invite')
    Invite(client :Socket,id : number){
        console.log("Invite",id)
        this.stateservice.invite(client,id)
    }

    @SubscribeMessage('Accepted')
    Accepte(client :Socket,id : number){
        console.log("Yes",id)
        this.stateservice.accept(client,id)
    }

    @SubscribeMessage('Refused')
    Refused(client :Socket,id : number){
        console.log("Refused",id)
        this.stateservice.refused(client,id)
    }
}