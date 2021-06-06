import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IAuthResponse } from './interface/auth-eesponse.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  singUp(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<IAuthResponse> {
    return this.authService.signIn(authCredentialDto);
  }

  @Get('/test')
  @UseGuards(AuthGuard())
  test() {
    return 'hello';
  }
}
