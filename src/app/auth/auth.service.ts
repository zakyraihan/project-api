import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { LoginDto, RegisterDto, UserDto } from './auth.dto';
import { Repository } from 'typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { ResponseSuccess } from 'src/interface';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/jwt.config';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    super();
  }

  generateJWT(payload: jwtpayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } // membuat method untuk generate jwt

  async register(payload: RegisterDto): Promise<ResponseSuccess> {
    const checkUserExist = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (checkUserExist) {
      throw new HttpException('user already registered', HttpStatus.FOUND);
    }

    payload.password = await hash(payload.password, 12); // hash password
    await this.authRepository.save(payload);

    return this._success('Register Berhasil');
  }

  async login(payload: LoginDto): Promise<ResponseSuccess> {
    const checkUserExist = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExist) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExist.password,
    ); // compare password yang dikirim dengan password yang ada di tabel

    if (checkPassword) {
      const jwtPayload: jwtpayload = {
        id: checkUserExist.id,
        nama: checkUserExist.nama,
        email: checkUserExist.email,
      };

      const access_token = await this.generateJWT(
        jwtPayload,
        '1d',
        jwt_config.access_token_secret,
      );

      const refresh_token = await this.generateJWT(
        jwtPayload,
        '7d',
        jwt_config.refresh_token_secret,
      );
      await this.authRepository.save({
        refresh_token: refresh_token,
        id: checkUserExist.id,
      }); // simpan refresh token ke dalam tabel

      return this._success('login succes', {
        ...checkUserExist,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async myProfile(id: number): Promise<ResponseSuccess> {
    const user = await this.authRepository.findOne({
      where: {
        id: id,
      },
    });

    return this._success('OKE', user);
  }

  async refreshToken(id: number, token: string): Promise<ResponseSuccess> {
    const checkUserExist = await this.authRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('user', checkUserExist);
    if (checkUserExist === null) {
      throw new UnauthorizedException();
    }
    const jwtPayload: jwtpayload = {
      id: checkUserExist.id,
      nama: checkUserExist.nama,
      email: checkUserExist.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      jwt_config.access_token_secret,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '7d',
      jwt_config.refresh_token_secret,
    );

    await this.authRepository.save({
      refresh_token: refresh_token,
      id: checkUserExist.id,
    });
    return this._success('Succes', {
      ...checkUserExist,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }
}
