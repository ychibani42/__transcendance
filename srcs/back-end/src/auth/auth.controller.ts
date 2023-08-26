import { Body, Controller, Post, Req, UseGuards ,Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {JwtAuthGuard} from './Guard/jwt-guard'
import {FortyTwoAuthGuard} from "./Guard/42-auth.guard";
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	/* Connexion */

	@Get('42/callback')
	@UseGuards(FortyTwoAuthGuard)
    async login(@Req() req:any, @Res() res:any)
    {
		const user = await this.authService.login(req.user._json.id,req.user._json.image.link);
		const jwt = await this.authService.tokenreturn(user);
		res.cookie("access_token",jwt);
		res.redirect("http://localhost:5173/");
		return (res);
    }

	@Get('/')
	@UseGuards(JwtAuthGuard)
	test() : string {
		return("awuduawvduybawudbww");
	}

	
	@Get('Checkjwt')
	@UseGuards(JwtAuthGuard) 
	CheckJWT(payload :any)
	{
		console.log(payload);
		return "ajhwbduwabduhw";
	}

	@Post('Inviter')
	async loginInviter(@Body() nbr:any, @Res() res:any){
		console.log("here", nbr._value);
		const user = await this.authService.login(nbr._value,"lol");
		const jwt = await this.authService.tokenreturn(user);
		res.cookie("access_token",jwt);
		res.redirect("http://localhost:5173/");
		return (res);
	}
}
