import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IUser, User } from 'src/common/decorators/user.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateGroupDto } from './dto/update-group.dto';

@UseGuards(AuthGuard)
@Controller('transaction/group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @User() user: IUser) {
    return this.groupService.create(createGroupDto, user.uid);
  }

  @Get()
  findAll(@User() user: IUser) {
    return this.groupService.findAll(user.uid);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: IUser) {
    const result = await this.groupService.findOne(id, user.uid);
    if (!result) {
      throw new BadRequestException('Invalid ID');
    }

    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @User() user: IUser,
  ) {
    if (updateGroupDto.name) {
      const existingName = await this.groupService.findOne(id, user.uid);
      if (existingName.name === updateGroupDto.name) {
        throw new BadRequestException('Group name already exist!');
      }
    }
    return this.groupService.update(id, updateGroupDto, user.uid);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.groupService.remove(id, user.uid);
  }
}
