import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser, User } from 'src/common/decorators/user.decorator';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { GroupService } from './group/group.service';
import { TransactionService } from './transaction.service';

@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly groupService: GroupService,
  ) {}

  @Post('add')
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User() user: IUser,
  ) {
    createTransactionDto.uid = user.uid;
    if (createTransactionDto.group) {
      const groupData = await this.groupService.findOne(
        createTransactionDto.group,
        user.uid,
      );
      if (!groupData) {
        throw new BadRequestException('Invalid Group!');
      }
    }
    return this.transactionService.create(createTransactionDto);
  }

  @Post('add/attachment')
  async attachment(@Body() body: CreateAttachmentDto, @User() user: IUser) {
    const { keys } = body;
    const urls = [];
    for (const key of keys) {
      const internalKey = `${user.uid}/attachments/${key}`;
      const result = await this.transactionService.generateUploadPresignedUrl(
        internalKey,
      );
      urls.push({
        key: internalKey,
        url: result,
      });
    }
    return urls;
  }

  @Get('get')
  async findAll(
    @Query('firstId') firstId: string | undefined,
    @Query('lastId') lastId: string | undefined,
    @Query('limit') pageSize: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('groupId') groupId: string,
    @User() user: IUser,
  ) {
    return this.transactionService.findAll(
      user.uid,
      firstId,
      lastId,
      pageSize,
      orderBy,
      order,
      groupId,
    );
  }

  @Get('get/count')
  async getCount(@User() user: IUser, @Query('groupId') groupId?: string) {
    const count = await this.transactionService.countTransactionByUserId(
      user.uid,
      groupId,
    );
    return {
      count,
    };
  }

  @Get('get/total')
  async getTotal(@User() user: IUser, @Query('groupId') groupId?: string) {
    return this.transactionService.sumTransactionAmountByUserId(
      user.uid,
      groupId,
    );
  }

  @Get('get/graph')
  async getGraph(@User() user: IUser, @Query('groupId') groupId?: string) {
    const data = await this.transactionService.findTransactionSumWithDateGroup(
      user.uid,
      groupId,
    );
    return data;
  }

  @Get('get/average')
  // @Header('Cache-Control', 'max-age=3600')
  async averageSpending(
    @User() user: IUser,
    @Query('groupId') groupId?: string,
  ) {
    return this.transactionService.averageSpending(user.uid, groupId);
  }

  @Get('get/:id')
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.transactionService.findOne(user.uid, id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @User() user: IUser,
  ) {
    updateTransactionDto.uid = user.uid;
    if (updateTransactionDto.group) {
      const groupData = await this.groupService.findOne(
        updateTransactionDto.group,
        user.uid,
      );
      if (!groupData) {
        throw new BadRequestException('Invalid Group!');
      }
    }
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.transactionService.remove(user.uid, id);
  }
}
