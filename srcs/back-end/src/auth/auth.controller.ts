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
		console.log(process.env.UID);
		console.log(process.env.SECRET_42_KEY);
		const user = await this.authService.login(req.user._json.id,req.user._json.image.link);
		const jwt = await this.authService.tokenreturn(user);
		res.cookie("access_token",jwt);
		res.redirect("http://localhost:5173/");
		return (res);
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
		const user = await this.authService.login(nbr.id42._value,nbr.name._value);
		const jwt = await this.authService.tokenreturn(user);
		res.cookie("access_token",jwt);
		res.json({redirect : '/'})
		return (res);
	}
}
