import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.UID_42,
      clientSecret: process.env.SECRET_42_KEY,
      callbackURL: 'http://localhost:3000/auth/42/callback',
    });
  }

  validate( accessToken: string, refreshToken: string,profile: any): any {
    return profile;
  }
}