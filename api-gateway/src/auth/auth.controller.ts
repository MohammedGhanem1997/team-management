import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ClientProxy } from "@nestjs/microservices";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponse } from "./dto/response.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject("AUTH_SERVICE")
    private readonly authServiceClient: ClientProxy
  ) {}

  private normalizeError(e: any): { status: number; message: string } {
    const candidates = [
      e?.status,
      e?.statusCode,
      e?.response?.statusCode,
      e?.response?.status,
    ];
    const statusCandidate = candidates.find((s) => Number.isInteger(s));
    const status =
      typeof statusCandidate === "number"
        ? statusCandidate
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      e?.message ||
      e?.response?.message ||
      e?.response?.error ||
      "Internal server error";
    return { status, message };
  }

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      return await firstValueFrom(
        this.authServiceClient.send<AuthResponse>("register", registerDto)
      );
    } catch (e: any) {
      const { status, message } = this.normalizeError(e);
      throw new HttpException(message, status);
    }
  }

  @Post("login")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "User logged in successfully" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    try {
      return await firstValueFrom(
        this.authServiceClient.send<AuthResponse>("login", loginDto)
      );
    } catch (e: any) {
      const { status, message } = this.normalizeError(e);
      throw new HttpException(message, status);
    }
  }
}
