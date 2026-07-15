import * as bcrypt from 'bcrypt'
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

    async register(dto: AuthCredentialsDto) {
        const existingUser = await this.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }
        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                password: await this.bcryptPassword(dto.password)
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    }

    async login(dto: AuthCredentialsDto) {
        const user = await this.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email });
        return { access_token: accessToken };
    }

    async findByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
    }

    async bcryptPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

}
