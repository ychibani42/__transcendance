import { BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';


interface Com
{
    socket : Socket
    id : Number
}


@Injectable()
export class StateService {
	constructor(
		private prismaService: PrismaService,
	) {}

    User : Array<Com> = []

    async connection(client : Socket , token : number){
        try {
            const user2 : Com = {
                socket : client,
                id : token
            }
            this.User.push(user2)
            await this.prismaService.user.findFirstOrThrow({where : {id: token}})
            await this.prismaService.user.update({where : {id : token},data : {state : 'Online'}})
        }
        catch (error) {
            console.log(error)
        }
    }

    async disconnect(client : Socket){
        try {
                let user;
                this.User.forEach((element) => {
                    if(element.socket == client)
                    {
                        user = element.id
                    }
                })
                await this.prismaService.user.findFirstOrThrow({where : {id: user}})
                await this.prismaService.user.update({where : {id : user},data : {state : 'Disconected'}})
                this.User.forEach((element) => {
                    if(element.socket == client)
                    {
                        let id = this.User.indexOf(element)
                        this.User.splice(id,1)
                    }
    
                })
            }
         catch (error) {
            console.log("Prisma error dis")
        }
    }

    async Game(client : Socket){
        try {
            let user;
                this.User.forEach((element) => {
                    if(element.socket == client)
                    {
                        user = element.id
                    }
                })
                await this.prismaService.user.findFirstOrThrow({where : {id: user}})
                await this.prismaService.user.update({where : {id : user},data : {state : 'OnGame'}})
        } catch (error) {
            console.log("Prisma error game")
        }
    }

    async Change(client : Socket){
        
        try {
                let user;
                this.User.forEach((element) => {
                    if(element.socket == client)
                    {
                        user = element.id
                    }
                })
                await this.prismaService.user.findFirstOrThrow({where : {id: user}})
                await this.prismaService.user.update({where : {id : user},data : {state : 'Online'}})
            } catch (error) {
                console.log("Prisma error change")
        }
    }

    async invite(client : Socket,id : number)
    {

        try {
            let user :any ;
            this.User.forEach((element) => {
                if(element.socket == client)
                {
                    user = element.id
                }
            })
            try {
                const users = await this.prismaService.user.findFirstOrThrow({where : {id: user}})
                const invited = await this.prismaService.user.findFirstOrThrow({where : {id: id}})
                if(invited.state == 'OnGame')
                {
                    client.emit('AlreadyInvite')
                    return
                }
                this.User.forEach((element) => {
                    if(element.id == id)
                    {
                        this.Game(client)
                        this.Game(element.socket)
                        element.socket.emit("invited",users.name,users.id)
                        return
                    }
                })
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async accept(client : Socket,id : number)
    {
        this.User.forEach((element) => {
            if(element.id == id)
            {
                element.socket.emit("accepted")
                client.emit("accepted")
            }
        })
    }

    async refused(client : Socket,id : number)
    {
        this.Change(client)
        this.User.forEach((element) => {
            if(element.id == id)
            {
                this.Change(element.socket)
                element.socket.emit("refused",id)
            }
        })
    }

}