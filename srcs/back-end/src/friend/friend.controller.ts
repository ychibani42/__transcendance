import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendDto , AddFriendDto} from './friend.dto';
import { JwtAuthGuard } from 'src/auth/Guard/jwt-guard';

@Controller('Friend')
export class FriendController {
	constructor(private FriendService: FriendService) {}

    @Post('')
    @UseGuards(JwtAuthGuard) 
    GetfriendsList(@Body() id : FriendDto){
        console.log(id)
        const friend = this.FriendService.friendlist(id.id)
        return friend 
    }

    @Post('add')
    @UseGuards(JwtAuthGuard) 
    Addfriends(@Body() req : AddFriendDto){
        const friend = this.FriendService.addfriend(req.id , req.addid)
        return friend 
    }
}