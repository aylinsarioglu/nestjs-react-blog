import { UserType } from ".";

declare global {
  namespace Express {
    // UserDocument'i User Interface'ine ekle
    interface User extends UserType{}
  }

    interface Request {
      cookies: {
        access_token?: string;
        refresh_token?: string;
      };
    }
}

export {};