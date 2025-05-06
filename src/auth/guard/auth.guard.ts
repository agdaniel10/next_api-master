import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { GqlExecutionContext } from '@nestjs/graphql';


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
  
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException("Token not found");
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {});
            request['user'] = payload;
        } catch (error) {
            console.error("JWT Verification Error: ",error.message);
            throw new UnauthorizedException("Invalid token");
        }

        return true;
    }
    
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;  // return token if type is Bearer, else undefined
    }
}