import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignupInput } from './dto/signup-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { AuthResponse } from './dto/auth-response';
import { SigninInput } from './dto/signin-input';
import { ForbiddenException, Request, UseGuards} from "@nestjs/common";
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LogoutResponse } from './dto/logout-response';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  signup(@Args('signupInput') signupInput: SignupInput) {
    try {
      return this.authService.signup(signupInput);
    } catch (error) {
      console.error(error);
      throw new Error("an error occurred");
    }
  }

  // @Mutation(() => AuthResponse)
  // @UseGuards(LocalAuthGuard)
  // async signin(@Request() req, @Args('siginInput') signinInput: SigninInput) {
  //   console.log(req.user);
  //   await this.authService.loginUser(req.user);
  // }

  @Mutation(() => AuthResponse)
  async signin(@Args('signinInput') signinInput: SigninInput) {
    return await this.authService.sigin(signinInput);
  }

  @Mutation(() => LogoutResponse)
  async logout(@Args('id', { type: () => Int }) id: number) {    
    return await this.authService.logout(id); // return message if logout success
  }

  @Query(() => [Auth], { name: 'auth' })
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }
}
