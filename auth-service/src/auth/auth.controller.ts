import { Controller, Post, Body } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse } from "./dto/response.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("register")
  async register(@Payload() registerDto: RegisterDto): Promise<AuthResponse> {
    console.log("🚀 ~ file: auth.controller.ts:14 ~ registerDto:", registerDto);
    return this.authService.register(registerDto);
  }

  @Post("register")
  async httpRegister(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    console.log("🚀 ~ file: auth.controller.ts:19 ~ registerDto:", registerDto);
    return this.authService.register(registerDto);
  }

  @MessagePattern("login")
  async login(@Payload() loginDto: LoginDto): Promise<AuthResponse> {
    console.log("🚀 ~ file: auth.controller.ts:24 ~ loginDto:", loginDto);
    return this.authService.login(loginDto);
  }

  @Post("login")
  async httpLogin(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    console.log("🚀 ~ file: auth.controller.ts:30 ~ loginDto:", loginDto);
    return this.authService.login(loginDto);
  }
}
