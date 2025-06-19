export interface LoginDto {
  userName: string;
  password: string;
}

export interface LoginUserResponseDTO {
  accessToken: string;
  expiresAt: string;
}