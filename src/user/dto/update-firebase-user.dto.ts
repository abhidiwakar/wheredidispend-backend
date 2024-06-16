import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateFirebaseUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Please enter a valid mobile number',
  })
  phoneNumber: string;
}
