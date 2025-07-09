import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: string | null = null;

  // Demo kullanıcı bilgileri - gerçek projede backend'den gelecek
  private users: User[] = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' }
  ];

  constructor() {
    this.currentUser = localStorage.getItem('currentUser');
  }

  public get currentUserValue(): string | null {
    return this.currentUser;
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', username);
      this.currentUser = username;
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
