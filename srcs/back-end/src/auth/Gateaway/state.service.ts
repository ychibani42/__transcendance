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

    async disconnect(client : Socket, token : any){
        
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

    async Game(client : Socket, token : any){
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

    async Change(client : Socket, token : any){
        
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

    async invite(client : Socket,token : any,id : number)
    {

        try {
            let decode : any
            if(token)
                decode = this.jwtService.decode(token)
            try {
                const user = await this.prismaService.user.findFirstOrThrow({where : {id: decode.id}})
                this.User.forEach((element) => {
                    if(element.id == id)
                    {
                        element.socket.emit("invited",user.name,user.id)
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


    async accept(client : Socket,token : any,id : number)
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

    async refused(client : Socket,token : any,id : number)
    {
        this.User.forEach((element) => {
            if(element.id == id)
            {
                element.socket.emit("refused",id)
            }
        })
    }
}