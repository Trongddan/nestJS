import { IsString } from 'class-validator';

export class RefreshDtoToken {
  @IsString()
  refreshToken: string;

  @IsString()
  deviceId: string;
}
