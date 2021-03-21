import {
  Injectable,
  UnauthorizedException,
  BadRequestException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignOptions } from "jsonwebtoken";
import moment from "moment";

import { CreateUserTokenDto } from "src/token/dto/create-user-token.dto";
import { UserService } from "src/user/user.service";
import { TokenService } from "src/token/token.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { MailService } from "../mail/mail.service";
import { IUser } from "../user/interfaces/user.interface";
import { statusEnum } from "../user/enums/status.enum";

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userService.create(createUserDto);
    await this.sendConfirmation(user);

    return true;
  }

  signIn(email, password) {}

  async confirm(token: string): Promise<IUser> {
    const data = await this.verifyToken(token);
    const user = await this.userService.findById(data._id);

    await this.tokenService.delete(data._id, token);

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active;
      return user.save();
    }
    throw new BadRequestException("Confirmation error");
  }

  async sendConfirmation(user: IUser) {
    const expiresIn = 60 * 60 * 24; // 24 hours

    const tokenPayload = {
      _id: user._id,
      status: user.status,
      roles: user.roles
    };

    const expireAt = moment()
      .add(1, "day")
      .toISOString();

    const token = await this.generateToken(tokenPayload, { expiresIn });
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`;

    await this.saveToken({ token, uId: user._id, expireAt });

    await this.mailService.send({
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: "Account Verifying",
      text: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
            `
    });
  }

  private async generateToken(data, options?: SignOptions): Promise<string> {
    return this.jwtService.sign(data, options);
  }

  private async verifyToken(token): Promise<any> {
    try {
      const data = this.jwtService.verify(token);
      const tokenExists = await this.tokenService.exists(data._id, token);

      if (tokenExists) {
        return data;
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async saveToken(createUserTokenDto: CreateUserTokenDto) {
    return await this.tokenService.create(createUserTokenDto);
  }
}
