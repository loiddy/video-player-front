import { inject, Injectable } from '@angular/core';
import { signInAnonymously } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: Auth = inject(Auth);
  token!: string;

  constructor() {}

  async getAuthToken(): Promise<string> {
    if (this.auth.currentUser) return await this.auth.currentUser?.getIdToken();
    const res = await signInAnonymously(this.auth);
    return await res.user.getIdToken();
  }
}
