import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { Token, User } from './interface';
import { guest } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(guest);
  public serverUrl= 'http://localhost:8081';
  //public serverUrl= 'http://10.11.3.3:8080/npdashboard';

  private userReq$ = this.http.get<User>(this.serverUrl+'/authenticate/me');

  constructor(private http: HttpClient, private token: TokenService) {
    this.token
      .change()
      .pipe(switchMap(() => (this.check() ? this.userReq$ : of(guest))))
      .subscribe((user) => this.user$.next(Object.assign({}, guest, user)));

    this.token
      .refresh()
      .pipe(switchMap(() => this.refresh()))
      .subscribe();
  }

  headers = new HttpHeaders({
    Authorization: this.token.headerValue(),
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Headers': '*',
  });

  check() {
    return this.token.valid();
  }

  login(email: string, password: string, rememberMe = false) {
    return this.http
      .post<Token>(this.serverUrl+'/authenticate/login', {
        username: email,
        password,
        remember_me: rememberMe,
      })
      .pipe(
        tap((token) => this.token.set(token)),
        map(() => this.check())
      );
  }

  refresh() {
    return this.http.post<Token>('/auth/refresh', {}).pipe(
      tap((token) => this.token.set(token, true)),
      map(() => this.check())
    );
  }

  logout() {
    return this.http.post(this.serverUrl+'/authenticate/logout',
    null, { 'headers' : this.headers }).pipe(
      tap(() => this.token.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }
}
