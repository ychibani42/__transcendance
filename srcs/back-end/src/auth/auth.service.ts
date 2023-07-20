import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	signIn() {
		return { msg: 'I am signed in' };
	}

	signUp() {
		return { msg: 'I am signed up' };
	}
}
