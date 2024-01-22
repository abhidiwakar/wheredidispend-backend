import { Controller, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser, User } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete('delete')
  remove(@User() { uid }: IUser) {
    return this.userService.remove(uid);
  }
}
