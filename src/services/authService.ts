import { ApiResult } from '../types/api';
import { LoginDto, LoginUserResponseDTO } from '../types/auth';
import { apiUrl } from '../utils/config';

export async function login(dto: LoginDto): Promise<ApiResult<LoginUserResponseDTO>> {
  const response = await fetch(apiUrl + '/Authentication/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  const data: ApiResult<LoginUserResponseDTO> = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Network response was not ok');
  }

  return data;
}