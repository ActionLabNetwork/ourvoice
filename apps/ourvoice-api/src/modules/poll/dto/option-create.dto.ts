import { IsString, Length } from 'class-validator';

export class PollOptionCreateDto {
  @IsString()
  @Length(1, 100)
  option: string;
}
