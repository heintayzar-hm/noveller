import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@server/users/users.service';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(private userService: UsersService) {} // Assuming you have a UserService to interact with your users

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email; // Assuming you have some form of user information attached to the request (e.g., after authentication)

    if (email) {
      const user = await this.userService.findByEmail(email);

      if (user) {
        return true; // User exists, allow access
      }
    }
      throw new UnauthorizedException({
          message: 'Username or password is incorrect!!',
        success: false,
    }); // User doesn't exist, deny access
  }
}
