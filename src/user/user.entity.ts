import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int, { description: 'accessToken field' })
  id: number;

  @Field()
  username: string;

  @Field(() => String, { nullable: false,  })
  email: string;

  @Field()
  password: string;
}
