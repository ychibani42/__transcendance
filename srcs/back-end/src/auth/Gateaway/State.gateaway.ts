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


    handleConnection(client :Socket){
        this.stateservice.connection(client,client.handshake.headers.cookies)
    }
    
    handleDisconnect(client :Socket){
        this.stateservice.disconnect(client,client.handshake.headers.cookies)
    }

    @SubscribeMessage('game')
    Gameconnection(client :Socket){
        this.stateservice.Game(client,client.handshake.headers.cookies)
    }

    @SubscribeMessage('Change')
    Change(client :Socket){
        this.stateservice.Change(client,client.handshake.headers.cookies)
    }

}