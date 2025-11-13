export type UserRole = "admin" | "customer";

export interface AuthUser {
  _id: string;
  email: string;
  role: UserRole;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
}
