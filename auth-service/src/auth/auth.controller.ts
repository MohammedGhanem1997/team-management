import { Controller, Post, Body } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse } from "./dto/response.dto";
import { buildHttpException, buildRpcException } from "../common/errors/error.helper";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("register")
  async register(@Payload() registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      return await this.authService.register(registerDto);
    } catch (err) {
      throw buildRpcException(err, "AuthController.register");
    }
  }

  @Post("register")
  async httpRegister(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      return await this.authService.register(registerDto);
    } catch (err) {
      throw buildHttpException(err, "AuthController.httpRegister");
    }
  }

  @MessagePattern("login")
  async login(@Payload() loginDto: LoginDto): Promise<AuthResponse> {
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      throw buildRpcException(err, "AuthController.login");
    }
  }

  @Post("login")
  async httpLogin(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      throw buildHttpException(err, "AuthController.httpLogin");
    }
  }
}
