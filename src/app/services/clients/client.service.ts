import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IClient, IPage } from '../../app/types/IClients';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  readonly baseUrl = 'https://igamingback.onrender.com/api/clients/';

  private readonly http = inject(HttpClient);
  private readonly clientsSubject = new BehaviorSubject<IPage<IClient> | null>(
    null
  );
  public clients$ = this.clientsSubject.asObservable();

  constructor() {
    this.loadInitialClients();
  }

  getPaginatedClients(
    page: number = 0,
    size: number = 10
  ): Observable<IPage<IClient>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<IPage<IClient>>(this.baseUrl, { params }).pipe(
      tap((response) => {
        this.clientsSubject.next(response);
      }),
      catchError((error) => {
        const errorMsg = this.getErrorMessage(error);
        AlertService.error(`Erro ao carregar clientes: ${errorMsg}`);
        throw error;
      })
    );
  }

  private loadInitialClients(): void {
    this.getPaginatedClients(0, 10).subscribe();
  }

  refreshClients(
    page: number = 0,
    size: number = 10
  ): Observable<IPage<IClient>> {
    return this.getPaginatedClients(page, size);
  }

  removeClient(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id).pipe(
      tap(() => {
        AlertService.success('Cliente removido com sucesso!');
      }),
      catchError((error) => {
        const errorMsg = this.getErrorMessage(error);
        AlertService.error(errorMsg);
        throw error;
      })
    );
  }

  addClient(client: Partial<IClient>): Observable<IClient> {
    return this.http.post<IClient>(this.baseUrl, client).pipe(
      tap((newClient) => {
        AlertService.success('Cliente cadastrado com sucesso!');
      }),
      catchError((error) => {
        const errorMsg = this.getErrorMessage(error);
        AlertService.error(errorMsg);
        throw error;
      })
    );
  }

  updateClient(client: Partial<IClient> & { id: number }): Observable<IClient> {
    return this.http.patch<IClient>(this.baseUrl + client.id, client).pipe(
      tap((updatedClient) => {
        AlertService.success('Cliente atualizado com sucesso!');
      }),
      catchError((error) => {
        const errorMsg = this.getErrorMessage(error);
        AlertService.error(errorMsg);
        throw error;
      })
    );
  }

  getClientById(id: number): Observable<IClient> {
    return this.http.get<IClient>(`${this.baseUrl}${id}`);
  }

  private getErrorMessage(error: any): string {
    if (typeof error.error === 'string') {
      return error.error;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    if (error.status === 0) {
      return 'Erro de conexão com o servidor';
    }
    return 'Erro desconhecido';
  }
}
