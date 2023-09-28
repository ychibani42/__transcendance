import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.extractJWT,
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: process.env.SECRET_ACCESS_TOKEN,
		});
	}

	async validate(payload: any) {
		return payload;
	}

	private static extractJWT(@Req() req): string | null {
		if (
			req.cookies &&
			'access_token' in req.cookies &&
			req.cookies.access_token.length > 0
		) {
			return req.cookies.access_token;
		}
		return null;
	}
}
