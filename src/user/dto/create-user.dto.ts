import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  telegramId: number;
}
