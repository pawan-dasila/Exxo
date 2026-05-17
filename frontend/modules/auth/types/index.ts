import { User } from "@/modules/user/types";
import { ApiResponse, ApiError } from "@/lib/types/api";
import { LoginInput, RegisterInput } from "./validations";

export type { User, ApiResponse, ApiError };

export interface AuthResponse {
  user: User;
  token?: string; // Often needed for production auth
}

export type LoginValues = LoginInput;
export type RegisterValues = RegisterInput;
