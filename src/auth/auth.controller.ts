import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// import { ConfirmAccountDto } from "./dto/confirm-account.dto";
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IUser } from '../user/interfaces/user.interface';
import { SignInDto } from './dto/signin.dto';
import { IReadableUser } from '../user/interfaces/readable-user.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<IUser> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signIn')
  async signIn(@Body(new ValidationPipe()) signInDto: SignInDto): Promise<IReadableUser> {
    return this.authService.signIn(signInDto);
  }

  // @Get("/confirm")
  // async confirm(@Query(new ValidationPipe()) query: ConfirmAccountDto) {
  //   await this.authService.confirm(query.token);
  //
  //   return true;
  // }
}
