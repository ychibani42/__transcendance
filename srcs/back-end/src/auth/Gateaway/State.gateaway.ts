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
        this.stateservice.disconnect(client,client.handshake.headers.cookies)
    }

    @SubscribeMessage('game')
    Gameconnection(client :Socket){
        return this.stateservice.Game(client,client.handshake.headers.cookies)
    }

    @SubscribeMessage('Change')
    Change(client :Socket){
        this.stateservice.Change(client,client.handshake.headers.cookies)
    }

    @SubscribeMessage('Invite')
    Invite(client :Socket,id : number){
        this.stateservice.invite(client,client.handshake.headers.cookies,id)
    }

    @SubscribeMessage('Accepted')
    Accepte(client :Socket,id : number){
        console.log("Yes",id)
        this.stateservice.accept(client,client.handshake.headers.cookies,id)
    }

    @SubscribeMessage('Refused')
    Refused(client :Socket,id : number){
        console.log("no",id)
        this.stateservice.refused(client,client.handshake.headers.cookies,id)
    }
}