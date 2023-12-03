import { AuthGuard } from '@nestjs/passport';

export class CurrentUserGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
