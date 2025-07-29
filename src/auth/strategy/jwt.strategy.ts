/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { accessTokenSecret } from 'src/common/constants/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessTokenSecret, // Replace with your actual secret key
    });
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: any) {
    return { userId: payload.id, email: payload.email, role: payload.role };
  }
}
