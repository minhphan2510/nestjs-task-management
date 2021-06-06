import { AuthCredentialDto } from './dto/auth-credential.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interface/jwt.interface';
import { IAuthResponse } from './interface/auth-eesponse.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwrService: JwtService,
  ) {}

  signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.createUser(authCredentialDto);
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<IAuthResponse> {
    const { username, password } = authCredentialDto;
    const user = await this.userRepository.findOne({ username });

    if (!user) throw new NotFoundException('User not found');

    const isValidPwd = await bcrypt.compare(password, user.password);

    if (!isValidPwd) throw new UnauthorizedException();

    const payload: IJwtPayload = { username };
    const accessToken = this.jwrService.sign(payload);

    return { accessToken };
  }
}
