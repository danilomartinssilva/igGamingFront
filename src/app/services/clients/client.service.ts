import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IClient } from '../../app/types/IClients';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  readonly baseUrl = 'https://igamingback.onrender.com/api/clients/';

  private http = inject(HttpClient);

  getClients(): Observable<IClient[]> {
    return this.http.get<IClient[]>(this.baseUrl);
  }

  removeClient(id: number): Observable<any> {
    console.log(id);
    return this.http.delete(this.baseUrl + id);
  }

  constructor() {}
}
