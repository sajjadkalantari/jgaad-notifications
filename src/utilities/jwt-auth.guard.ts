import { Injectable } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpirationTime: true,
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any) {
    return { email: payload.email };
  }
}
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


