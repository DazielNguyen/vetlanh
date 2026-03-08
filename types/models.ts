// User Model
export interface User {
  id: string;
  email: string;
  userNname: string; // tên trường tùy backend — đổi thành fullName/name nếu cần
  role: string[]; // QUAN TRỌNG: role là ARRAY, không phải string đơn
  avatarUrl?: string;
}

// Decoded JWT Token
export interface DecodedToken extends User {
  nbf?: number;
  exp?: number;
  iat?: number;
}
