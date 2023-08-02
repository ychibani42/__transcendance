import { Controller, Get, Param } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from './models/user.model';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UserService) {}

	// @Post()
	// create(@Body() createUserDto: CreateUserDto): Promise<User> {
	// 	return this.userService.create(createUserDto);
	// }

	// @Get()
	// findAll(): Promise<User[]> {
	// 	return this.userService.findAll();
	// }

	@Get(':id')
	findOne(@Param('id') id: string): any {
		return this.userService.findOne(id);
	}

	// @Delete(':id')
	// remove(@Param('id') id: string): Promise<void> {
	// return this.userService.remove(id);
	// }
}
