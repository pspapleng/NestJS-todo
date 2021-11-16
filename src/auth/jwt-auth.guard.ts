import { ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard, } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {

        const { name = null } = info || {}
        if (name === 'TokenExpiredError') throw new ForbiddenException()
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

}
