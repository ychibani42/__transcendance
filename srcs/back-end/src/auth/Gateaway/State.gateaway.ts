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
        console.log("Connect",client.id)
        await this.stateservice.connection(client,id)
    }

    async handleDisconnect(client :Socket){
        console.log("Disconnect State",client.id)
        await this.stateservice.disconnect(client)
    }

    @SubscribeMessage('game')
    async Gameconnection(client :Socket){
        console.log("GAME STATE",client.id)
        this.stateservice.Game(client)
    }

    @SubscribeMessage('Change')
    async Change(client :Socket){
        console.log("CHANGE OO",client.id)
        await this.stateservice.Change(client)
    }

    @SubscribeMessage('Invite')
    async Invite(client :Socket,id : number){
        console.log("Invite",id)
        await this.stateservice.invite(client,id)
    }

    @SubscribeMessage('Accepted')
    async Accepte(client :Socket,id : number){
        console.log("Yes",id)
        await this.stateservice.accept(client,id)
    }

    @SubscribeMessage('Refused')
    async Refused(client :Socket,id : number){
        console.log("Refused",id)
        await this.stateservice.refused(client,id)
    }
}