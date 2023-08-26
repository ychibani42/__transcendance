import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from "socket.io";
@WebSocketGateway({
    cors: {
      origin: "*",
    },
    namespace : 'game'
})
export class GameGateway{

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    sendmsg(){
        console.log("reach");
        this.server.emit('connected',"augwdvywtadywvad")
    }

}