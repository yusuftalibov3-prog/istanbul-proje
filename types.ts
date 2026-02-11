
export enum UserRole {
  STUDENT = 'Öğrenci',
  SHOPKEEPER = 'Esnaf',
  PARENT = 'Veli'
}

export interface SolidarityMessage {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  message: string;
  role: UserRole;
  createdAt: number;
}

export type ViewState = 'landing' | 'feed';
