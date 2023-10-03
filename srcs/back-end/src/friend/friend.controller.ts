import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendDto, AddFriendDto, BlockFriendDto } from './friend.dto';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';

@Controller('friend')
export class FriendController {
	constructor(private FriendService: FriendService) {}

	@Post('')
	@UseGuards(JwtAuthGuard)
	GetfriendsList(@Body() id: FriendDto) {
		const friend = this.FriendService.friendlist(id.id);
		return friend;
	}

	@Post('blocklist')
	@UseGuards(JwtAuthGuard)
	GetblockedList(@Body() id: FriendDto) {
		const block = this.FriendService.blockedlist(id.id);
		return block;
	}

	@Post('add')
	@UseGuards(JwtAuthGuard)
	Addfriends(@Body() req: AddFriendDto) {
		const friend = this.FriendService.addfriend(req.id, req.addid);
		return friend;
	}

	@Post('blocked')
	@UseGuards(JwtAuthGuard)
	Blockedfriends(@Body() req: BlockFriendDto) {
		const block = this.FriendService.blockfriend(req.id, req.blockid);
		return block;
	}

	@Post('unblock')
	@UseGuards(JwtAuthGuard)
	Unblockedfriends(@Body() req: BlockFriendDto) {
		const block = this.FriendService.unblockfriend(req.id, req.blockid);
		return block;
	}
}
