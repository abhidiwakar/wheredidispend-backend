import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser, User } from 'src/common/decorators/user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionService } from './transaction.service';

@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('add')
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User() user: IUser,
  ) {
    createTransactionDto.uid = user.uid;
    return this.transactionService.create(createTransactionDto);
  }

  @Get('get')
  async findAll(
    @Query('firstId') firstId: string | undefined,
    @Query('lastId') lastId: string | undefined,
    @Query('limit') pageSize: number,
    @User() user: IUser,
  ) {
    return this.transactionService.findAll(user.uid, firstId, lastId, pageSize);
  }

  @Get('get/average')
  @Header('Cache-Control', 'max-age=3600')
  async averageSpending(@User() user: IUser) {
    return this.transactionService.averageSpending(user.uid);
  }

  @Get('get/:id')
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.transactionService.findOne(user.uid, id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @User() user: IUser,
  ) {
    updateTransactionDto.uid = user.uid;
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.transactionService.remove(user.uid, id);
  }
}
