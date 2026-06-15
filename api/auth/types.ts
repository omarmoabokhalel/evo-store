export type SessionPayload = {
  unionId: string;
  clientId: string;
};

export type UserProfile = {
  user_id: string;
  name: string;
  avatar_url: string;
  email?: string;
  role?: "user" | "admin";
};
