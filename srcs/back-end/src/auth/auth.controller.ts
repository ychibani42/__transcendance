import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	/* Connexion */

	@Post('signin')
	signIn(@Body() dto: AuthDto) {
		return this.authService.signIn(dto.username, dto.password);
	}

	/* Inscription */
	@Post('signup')
	signUp(@Body() dto: AuthDto) {
		return this.authService.signUp(dto);
	}
}
