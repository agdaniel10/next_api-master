import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


export class JwtStrategy extends PassportStrategy(Strategy,"jwt"){
  constructor(){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpriation: false,
        secretOrKey: `${process.env.ACCESS_TOKEN_SECRET}`
    })
  }

  validate(payload: any){
    return {
        user: payload.sub,
        username: payload.username,
    }
  }
}