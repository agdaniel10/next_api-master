import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignupInput } from './dto/signup-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SigninInput } from './dto/signin-input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(SignupInput: SignupInput) {
    try {
      const hashedPassword = await bcrypt.hash(SignupInput.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...SignupInput,
          password: hashedPassword,
        },
      });
      const { accessToken, refreshToken } = await this.createTokens(user);
      await this.updateRefreshToken(user.id, refreshToken);
      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error(error);
    }
  }

  async sigin(signinInput: SigninInput) {
    const user = await this.validateUser(
      signinInput.username,
      signinInput.password,
    );
    if (!user) {
      return new ForbiddenException('invalid username or password');
    }
    return this.loginUser(user); // return accessToken and refreshToken and user object if user is valid and login success
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async createTokens(user: any) {
    const accessToken = this.jwtService.signAsync(
      { userId: user.id, email: user.email },
      { secret: `${process.env.ACCESS_TOKEN_SECRET}` },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId: user.id, email: user.email, accessToken: accessToken },
      { secret: `${process.env.REFRESH_TOKEN_SECRET}` },
    );
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return user;
  }

  async loginUser(user: any) {
    const { accessToken, refreshToken } = await this.createTokens(user);
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: { id: userId, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
    return { loggedOut: true }; // return message if logout success
  }
}
