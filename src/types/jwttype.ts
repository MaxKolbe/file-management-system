import { JwtPayload } from 'jsonwebtoken';

export interface StaffPayload extends JwtPayload {
  id: string; 
}