import {
  IsDateString,
  IsISO4217CurrencyCode,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  uid: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsISO4217CurrencyCode()
  currency: string;
}
