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
        private jwtService : JwtService
	) {}

    User : Array<Com> = []

    async connection(client : Socket , token : number){
        try {

            await this.prismaService.user.findFirstOrThrow({where : {id: token}})
            await this.prismaService.user.update({where : {id : token},data : {state : 'Online'}})
            const user2 : Com = {
                socket : client,
                id : token
            }
            this.User.push(user2)
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
                console.log("userid ",user)
                await this.prismaService.user.findFirstOrThrow({where : {id: user}})
                await this.prismaService.user.update({where : {id : user},data : {state : 'Disconected', otpvalider : false}})
                this.User.forEach((element) => {
                    if(element.socket == client)
                    {
                        let id = this.User.indexOf(element)
                        this.User.splice(id,1)
                    }
    
                })
            }
         catch (error) {
            console.log(error)
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
            try {
                await this.prismaService.user.findFirstOrThrow({where : {id: user}})
                await this.prismaService.user.update({where : {id : user},data : {state : 'OnGame'}})
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
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
                try {
                    await this.prismaService.user.findFirstOrThrow({where : {id: user}})
                    await this.prismaService.user.update({where : {id : user},data : {state : 'Online'}})
                } catch (error) {
                    console.log(error)
                }
            } catch (error) {
            console.log(error)
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
                console.log("Inviting" , users.id , "User.state ",users.state , "name ", users.name)
                const invited = await this.prismaService.user.findFirstOrThrow({where : {id: id}})
                if(invited.state == 'OnGame')
                {
                    console.log("Inviting 2" , id)
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
                console.log("Accepted",id)
                element.socket.emit("accepted")
                client.emit("accepted")
            }
        })
    }

    async refused(client : Socket,id : number)
    {
        console.log("refused", id)
        this.Change(client)
        this.User.forEach((element) => {
            if(element.id == id)
            {
                console.log("ref", id)
                this.Change(element.socket)
                element.socket.emit("refused",id)
            }
        })
    }
}