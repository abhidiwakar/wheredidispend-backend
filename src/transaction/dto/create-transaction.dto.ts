import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class MetaData {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  data: string;
}

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetaData)
  metadata?: MetaData[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
