import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dotenv from 'dotenv';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { PassportModule } from '@nestjs/passport';

dotenv.config();

@Module({
  providers: [ AuthService, AuthResolver, LocalStrategy, JwtStrategy, JwtService, PrismaService],
  imports: [
    PassportModule,
    JwtModule.register({
    secret: `${process.env.JWT_SECRET}`,
    signOptions: { expiresIn: '1d' },
    global: true,
  })],
})
export class AuthModule {}
