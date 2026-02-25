import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      // token'i cookie'den al
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.access_token,
      ]),
      //  tokenı doğrulamak için kullanılacak anahtar
      secretOrKey: configService.get('JWT_ACCESS_SECRET') || 'default',
    });
  }

  // tokenı doğruladıktan sonra çalışır
  async validate(payload: any) {
    // payload'ın içindeki kullanıcı id'sine sahip kullanıcı mevcut mu
    const user = await this.userService.findById(payload.userId);

    // kullanıcıyı bulunmadıysa hata dön 
    if(!user){
        throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    // kullanıcı mevcut ise kullanıcıyı döndür
    return user;
  }
}
