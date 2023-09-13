import {
	Body,
	Controller,
	Post,
	Req,
	UseGuards,
	Get,
	Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './Guard/jwt-guard';
import { FortyTwoAuthGuard } from './Guard/42-auth.guard';
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	/* Connexion */

	@Get('42/callback')
	@UseGuards(FortyTwoAuthGuard)
	async login(@Req() req: any, @Res() res: any) {
		const user = await this.authService.login(
			req.user._json.id,
			req.user._json.image.link,
		);
		const jwt = await this.authService.tokenreturn(user);
		res.cookie('access_token', jwt);
		res.redirect('http://localhost:5173/');
		return res;
	}

	@Post('Inviter')
	async loginInviter(@Body() nbr: any, @Res() res: any) {
		const user = await this.authService.loginInviter(nbr.id42._value);
		const jwt = await this.authService.tokenreturn(user);
		res.cookie("access_token",jwt);
		res.json({redirect : '/'})
		return (res);
	}

	@Get('Checkjwt')
	@UseGuards(JwtAuthGuard) 
	CheckJWT(@Req() req:any)
	{
		const decode = this.authService.decodedtok(req.cookies.access_token)
		return decode;
	}

	@Post('Button2FA')
	@UseGuards(JwtAuthGuard)
	async Button2FA(@Body() nbr:any){
		const good = this.authService.changeotp(nbr.id);
		return good;
	}

	@Post("Generate2FA")
	@UseGuards(JwtAuthGuard)
	async GenerateQR(@Req() req, @Body() nbr:any)
	{

	}
}
