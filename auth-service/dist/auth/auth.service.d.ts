import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './dto/response.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private teamServiceClient;
    constructor(userRepository: Repository<User>, jwtService: JwtService, teamServiceClient: ClientProxy);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    validateUser(userId: string): Promise<User | null>;
}
