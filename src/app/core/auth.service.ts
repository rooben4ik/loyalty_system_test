import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export type FieldType = 'text' | 'number';
export interface SchemaElement { name: string; text: string; type: FieldType; }
export interface ApiResponse {
  result: { resultCode: number; resultComment: string };
  schema: { name: string; text: string; color: string; elements: SchemaElement[] };
}

const SID_KEY = 'sid';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private sidSubject = new BehaviorSubject<string | null>(sessionStorage.getItem(SID_KEY));
  sid$ = this.sidSubject.asObservable();
  get sid() { return this.sidSubject.value; }

  private setSid(value: string | null) {
    this.sidSubject.next(value);
    if (value) sessionStorage.setItem(SID_KEY, value);
    else sessionStorage.removeItem(SID_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.sidSubject.value;
  }

  login(body: { login: string; password: string }): Observable<{ sid: string }> {
    return this.http.post<{ sid: string }>('/api/user/login', body).pipe(
      tap(res => this.setSid(res.sid))
    );
  }

  logout() {
    this.setSid(null);
  }

  fetchSchema(): Observable<ApiResponse> {
    return this.http.post<ApiResponse>('/api/schema/test', {});
  }
}
