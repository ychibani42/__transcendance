import { BadRequestException, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

enum state {
	onroom,
	config,
	ready,
	play,
	finish,
}

interface ball {
	x: number;
	y: number;
	r: number;
	speed: number;
	velX: number;
	velY: number;
}

interface player {
	x: number;
	y: number;
	w: number;
	h: number;
	score: number;
	socket: Socket;
	id: number;
	config: boolean;
}

interface Room {
	state: state;
	speed: boolean;
	name: string;
	ball: ball;
	play: player;
	play2: player;
	ready: boolean;
	ready2: boolean;
}

@Injectable({})
export class GameService {
	constructor(
		private schedulerRegistry: SchedulerRegistry,
		private prismaService: PrismaService,
	) {}
	Rooms: Array<Room> = [];
	Matchmacking: Array<player> = [];

	//ROOM GESTION
	JoinQueue(client: Socket, id: number) {
		let newplay: player;
		newplay = {
			x: 0,
			y: 0,
			w: 8,
			h: 37,
			score: 0,
			socket: client,
			id: id,
			config: false,
		};
		for (let index = 0; index < this.Matchmacking.length; index++) {
			if (newplay.id === this.Matchmacking[index].id) return;
		}
		this.Matchmacking.push(newplay);
		client.emit('onQueue');
		while (this.Matchmacking.length >= 2) {
			this.createroom(this.Matchmacking.shift(), this.Matchmacking.shift());
		}
	}

	async createroom(play: player | undefined, play2: player | undefined) {
		const id = play?.id;
		if (play) {
			const user = await this.prismaService.user.findUniqueOrThrow({
				where: { id: id },
			});
			if (user.name && play && play2) {
				const room: Room = {
					state: state.config,
					name: user.name,
					ball: {
						x: 150,
						y: 75,
						r: 5,
						speed: 2,
						velX: 1.5,
						velY: 0,
					},
					speed: false,
					play: play,
					play2: play2,
					ready: false,
					ready2: false,
				};
				if (this.Rooms.length == 0) this.addInterval();
				room.play.x = 15;
				room.play2.x = 300 - 15 - 8;
				room.play2.socket.emit('playerdef', 1, room.name);
				room.play.socket.emit('playerdef', 0, room.name);
				room.play2.socket.emit('config');
				room.play.socket.emit('config');
				this.Rooms.push(room);
			}
		}
	}

	ReadyGame(client: Socket, name: string) {
		this.Rooms.forEach((element) => {
			if (element.name == name) {
				if (element.play.socket == client) element.ready = true;
				if (element.play2.socket == client) element.ready2 = true;
				if (element.ready == true && element.ready2 == true) {
					element.state = state.play;
				}
			}
		});
	}

	ConfigGame(client: Socket, speed: boolean, name: string) {
		this.Rooms.forEach((element) => {
			if (element.name == name) {
				if (element.play.socket == client) {
					element.play.config = true;
					element.speed = speed;
				}
				if (element.play2.socket == client) {
					element.play2.config = true;
				}
				if (element.play.config == true && element.play2.config == true) {
					element.state = state.onroom;
				}
			}
		});
	}

	async registerGame(room: Room) {
		await this.prismaService.game.create({
			data: {
				score: [room.play.score, room.play2.score],
				player1: room.play.id,
				player2: room.play2.id,
			},
		});
	}

	//GAME CALCUL
	rungame(GameService: GameService) {
		try {
			GameService.Rooms.forEach((element) => {
				if (element.state == state.play) {
					GameService.calcball(element);
					element.play.socket.emit(
						'pos',
						element.play2.y,
						element.ball.x,
						element.ball.y,
					);
					element.play2.socket.emit(
						'pos',
						element.play.y,
						element.ball.x,
						element.ball.y,
					);
				}
				if (element.state == state.onroom) {
					element.play2.socket.emit('OnRoom');
					element.play.socket.emit('OnRoom');
				}
				if (element.state == state.finish) {
					GameService.registerGame(element);
					const id = GameService.Rooms.indexOf(element);
					GameService.Rooms.splice(id, 1);
				}
			});
		} catch (error) {
			console.log(error);
		}
	}

	updateY(pos: number, name: string, client: Socket) {
		this.Rooms.forEach((element) => {
			if (element.name == name) {
				if (element.play.socket == client) {
					element.play.y = pos;
				}
				if (element.play2.socket == client) {
					element.play2.y = pos;
				}
			}
		});
	}

	colition(bal: ball, play: player) {
		const ballc = {
			top: 0,
			bot: 0,
			l: 0,
			r: 0,
		};
		const playC = {
			top: 0,
			bot: 0,
			l: 0,
			r: 0,
		};
		ballc.top = bal.y - bal.r;
		ballc.bot = bal.y + bal.r;
		ballc.l = bal.x - bal.r;
		ballc.r = bal.x + bal.r;

		playC.top = play.y;
		playC.bot = play.y + play.h;
		playC.l = play.x;
		playC.r = play.x + play.w;

		return (
			playC.l < ballc.r &&
			playC.top < ballc.bot &&
			playC.r > ballc.l &&
			playC.bot > ballc.top
		);
	}

	calcball(room: Room) {
		const ball = room.ball;
		ball.x += ball.velX;
		ball.y += ball.velY;
		if (ball.y + ball.r > 150) {
			ball.y = 150 - ball.r;
			ball.velY = -ball.velY;
		}
		if (ball.y - ball.r < 0) {
			ball.y = 0 + ball.r;
			ball.velY = -ball.velY;
		}
		const player = ball.x < 300 / 2 ? room.play : room.play2;
		if (this.colition(ball, player)) {
			let colpoint = ball.y - (player.y + 37 / 2);
			colpoint = colpoint / (player.h / 2);
			const anglered = (colpoint * Math.PI) / 4;

			const dir = ball.x < 300 / 2 ? 1 : -1;
			ball.velX = dir * ball.speed * Math.cos(anglered);
			ball.velY = ball.speed * Math.sin(anglered);
			if (ball.speed < 5 && room.speed == true) {
				ball.speed += 0.2;
			}
		}
		if (ball.x + ball.r > 300) {
			room.play.score++;
			this.resetball(room);
			room.play2.socket.emit('score', room.play.score, room.play2.score);
			room.play.socket.emit('score', room.play.score, room.play2.score);
		}
		if (ball.x - ball.r < 0) {
			room.play2.score++;
			this.resetball(room);
			room.play2.socket.emit('score', room.play.score, room.play2.score);
			room.play.socket.emit('score', room.play.score, room.play2.score);
		}
		room.ball = ball;
		if (room.play.score == 5) {
			room.state = state.finish;
			room.play.socket.emit('finish', 'Winner');
			room.play2.socket.emit('finish', 'Looser');
		}
		if (room.play2.score == 5) {
			room.state = state.finish;
			room.play2.socket.emit('finish', 'Winner');
			room.play.socket.emit('finish', 'Looser');
		}
	}

	resetball(room: Room) {
		room.ball.x = 150;
		room.ball.y = 75;
		room.ball.speed = 2;
		room.ball.velX = 1.5 * (room.ball.velX > 0 ? 1 : -1);
		room.ball.velY = 0;
	}

	remove(socket: Socket) {
		this.stoploop();
	}

	//INTERVAL GESTION

	stoploop() {
		if (this.Rooms.length != 0) return;
		try {
			if (this.schedulerRegistry.doesExist('interval', 'game')) {
				this.schedulerRegistry.deleteInterval('game');
			}
		} catch (error) {
			console.log('ERROR WITH SCH REG', error);
		}
	}

	addInterval() {
		try {
			console.log('add');
			const interval = setInterval(this.rungame, 15, this);
			this.schedulerRegistry.addInterval('game', interval);
		} catch (error) {
			console.log('ERROR WITH SCH REG', error);
		}
	}

	async getallgame() {
		try {
			const games = await this.prismaService.game.findMany({
				include: {
					user1: true,
					user2: true,
				},
			});
			return games;
		} catch (error) {
			console.log(error);
		}
	}

	async research(name: string) {
		try {
			await this.prismaService.user.findFirstOrThrow({
				where: {
					name: name,
				},
			});
		} catch (error) {
			throw new BadRequestException('no match');
		}
		try {
			const games = await this.prismaService.game.findMany({
				where: {
					OR: [
						{
							user2: {
								name: name,
							},
						},
						{
							user1: {
								name: name,
							},
						},
					],
				},
				include: {
					user1: true,
					user2: true,
				},
			});
			return games;
		} catch (error) {
			console.log(error);
		}
	}
}
