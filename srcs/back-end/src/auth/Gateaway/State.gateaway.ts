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


    async handleConnection(client :Socket){
        await this.stateservice.connection(client,client.handshake.headers.cookies)
    }
    
    async handleDisconnect(client :Socket){
        await this.stateservice.disconnect(client,client.handshake.headers.cookies)
    }

    @SubscribeMessage('game')
    async Gameconnection(client :Socket){
        await this.stateservice.Game(client,client.handshake.headers.cookies)
    }

    @SubscribeMessage('Change')
    async Change(client :Socket){
        await this.stateservice.Change(client,client.handshake.headers.cookies)
    }

}