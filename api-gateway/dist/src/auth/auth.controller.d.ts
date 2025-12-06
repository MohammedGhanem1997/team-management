import { ClientProxy } from "@nestjs/microservices";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse } from "./dto/response.dto";
export declare class AuthController {
    private readonly authServiceClient;
    constructor(authServiceClient: ClientProxy);
    private normalizeError;
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
}
