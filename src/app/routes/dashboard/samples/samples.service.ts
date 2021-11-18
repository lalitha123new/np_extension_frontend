import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '@core/authentication/token.service';
import { statModel } from '@core/models/stats';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SamplesService {
  constructor(private httpclient: HttpClient, private token: TokenService) {}
  public serverUrl= 'http://localhost:8081';
  //public serverUrl= 'http://10.11.3.3:8080/npdashboard';
  headers = new HttpHeaders({
    Authorization: this.token.headerValue(),
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Headers': '*',
  });

  getStats(): Observable<statModel> {
    return this.httpclient.get<statModel>(
      this.serverUrl+'/api/dashboard/summary/tat',
      { headers: this.headers }
    );
  }

  getSamples(): Observable<any[]> {
    return this.httpclient.get<any[]>(
      this.serverUrl+'/api/dashboard/count/daily/14',
      { headers: this.headers }
    );
  }

  getMonthCount(): Observable<number> {
    return this.httpclient.get<number>(
      this.serverUrl+'/api/dashboard/count/month',
      { headers: this.headers }
    );
  }

  getYearCount(): Observable<number> {
    return this.httpclient.get<number>(
      this.serverUrl+'/api/dashboard/count/year',
      { headers: this.headers }
    );
  }
}
