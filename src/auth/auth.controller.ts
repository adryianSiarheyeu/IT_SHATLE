import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { ConfirmAccountDto } from "./dto/confirm-account.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ): Promise<boolean> {
    return this.authService.signUp(createUserDto);
  }

  @Get("/confirm")
  async confirm(@Query(ValidationPipe) query: ConfirmAccountDto) {
    await this.authService.confirm(query.token);

    return true;
  }
}
