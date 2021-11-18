import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '@core/authentication/token.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurnAroundTimeService {
  constructor(private http: HttpClient, private token: TokenService) {}
  public serverUrl= 'http://localhost:8081';
  //public serverUrl= 'http://10.11.3.3:8080/npdashboard';
  headers = new HttpHeaders({
    Authorization: this.token.headerValue(),
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Headers': '*',
  });
  getCharts(startDate: String, endDate: String): Observable<any[]> {
    return this.http.get<any[]>(
      this.serverUrl+`/api/dashboard/cases/${startDate}/${endDate}`,
      { headers: this.headers }
    );
  }

  getTatBreakout(
    tatStartValues: number[],
    tatEndValues: number[],
    biopsyType: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      this.serverUrl+`/api/dashboard/tat/${biopsyType}/${tatStartValues}/${tatEndValues}`,
      { headers: this.headers }
    );
  }

  getSpecialRequests(
    startDate: number,
    endDate: number,
    biopsyType: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      this.serverUrl+`/api/dashboard/requests/${biopsyType}/${startDate}/${endDate}`,
      { headers: this.headers }
    );
  }

  tatRanges: Subject<any[]> = new Subject<any[]>();
  category: BehaviorSubject<string> = new BehaviorSubject<string>('');
  dates: Subject<string[]> = new Subject<string[]>();
  selectedTatRange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
}
