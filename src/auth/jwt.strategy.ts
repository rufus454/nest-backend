import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

type Payload = {
  id: number;
  email: string;
};

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: 'secret',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate(payload: Payload, request: Request) {
    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { email } = payload;
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    request.user = user;
    return request.user;
  }
}
