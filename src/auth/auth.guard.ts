import { CanActivate, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: any): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException()
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        if (!token) {
            throw new UnauthorizedException('Invalid token');
        }

        try {
            const payload = await this.jwtService.verify(token);
            request.user = payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
        return true;
    }

}