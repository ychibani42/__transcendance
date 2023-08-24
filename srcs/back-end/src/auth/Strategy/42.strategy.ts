import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID:"u-s4t2ud-154bdbdd9972ff4105c978d0eb2fa2c60160244c639d567fe9cd04a0f9774977",
      clientSecret: "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",
      callbackURL: 'http://localhost:3000/auth/42/callback',
    });
  }

  validate( accessToken: string, refreshToken: string,profile: any): any {
    return profile;
  }
}