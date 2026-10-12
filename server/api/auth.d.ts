// auth.d.ts
declare module "#auth-utils" {
  interface User {
    id: string | number;
    email: string;
    username?: string;
    name?: string;
  }

  interface SecureSessionData {
    accessToken: string;
  }
}

export {};
