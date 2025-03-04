export interface UserDto {
  id?: string;
  name: string;
  email: string;
  money: number;
  isVerified: boolean;
}

export interface UserSimplifiedDto {
  id: string;
  name: string;
  email: string;
}

export interface UserWithPasswordDto extends UserDto {
  password: string | null;
}
