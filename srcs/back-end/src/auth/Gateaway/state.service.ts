import { BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class StateService {
	constructor(
		private prismaService: PrismaService,
        private jwtService : JwtService
	) {}

    async connection(client : Socket , token : any){
        
        try {
            let decode : any
            if(token)
                decode = this.jwtService.decode(token)
            try {
                const user = await this.prismaService.user.findFirstOrThrow({where : {id: decode.id}})
                await this.prismaService.user.update({where : {id : decode.id},data : {state : 'Online'}})
            } catch (error) {
                console.log(error)
            } 
        } catch (error) {
            console.log(error)
        }
    }

    async disconnect(client : Socket, token : any){
        
        try {
            let decode : any
            if(token)
                decode = this.jwtService.decode(token)
            try {
                await this.prismaService.user.findFirstOrThrow({where : {id: decode.id}})
                await this.prismaService.user.update({where : {id : decode.id},data : {state : 'Disconected', otpvalider : false}})
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async Game(client : Socket, token : any){
        try {
            let decode : any
            if(token)
                decode = this.jwtService.decode(token)
            try {
                const user = await this.prismaService.user.findFirstOrThrow({where : {id: decode.id}})
                await this.prismaService.user.update({where : {id : decode.id},data : {state : 'OnGame'}})
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async Change(client : Socket, token : any){
        
        try {
                let decode : any
                if(token)
                    decode = this.jwtService.decode(token)
                try {
                    const user = await this.prismaService.user.findFirstOrThrow({where : {id: decode.id}})
                    await this.prismaService.user.update({where : {id : decode.id},data : {state : 'Online'}})
                } catch (error) {
                    console.log(error)
                }
            } catch (error) {
            console.log(error)
        }
    }
}