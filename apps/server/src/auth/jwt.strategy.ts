import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { HashService } from '@server/lib/Hashing';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const cookieExtractor = (req: any) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['x-access_token'];
      }
      if (!token) {
        return null;
      }
      // decrypt
      const decryptedToken = HashService.decrypt(token);
      return decryptedToken;
    }

    const headerExtractor = (req: any) => {
      let token = null;
      if (req && req.headers) {
        token = req.headers['authorization'];
      }
      if (!token) {
        return null;
      }
      token = token.replace('Bearer ', '');
      // decrypt
      const decryptedToken = HashService.decrypt(token);
      return decryptedToken;
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, headerExtractor]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }


}
