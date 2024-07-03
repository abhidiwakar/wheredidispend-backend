import { ArrayMinSize, IsArray, IsString, Min } from 'class-validator';

export class CreateAttachmentDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  keys: string[];
}
