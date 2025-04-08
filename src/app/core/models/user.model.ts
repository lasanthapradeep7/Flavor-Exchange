export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  favorites?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  username: string;
  confirmPassword: string;
}