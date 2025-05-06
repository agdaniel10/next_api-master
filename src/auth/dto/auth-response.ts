import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@ObjectType()
export class AuthResponse {
  @Field(() => String, { description: 'accessToken field' })
  accessToken: string;

  @Field(() => String, {description: "refreshToken field"})
  refreshToken: string;

  @Field(() => User)
  user: User;
}
