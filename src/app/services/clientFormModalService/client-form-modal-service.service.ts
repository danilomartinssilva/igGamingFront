import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IClient } from '../../app/types/IClients';
export interface ClientFormModalState {
  show: boolean;
  client?: IClient | null;
}

@Injectable({
  providedIn: 'root',
})
export class ClientFormModalServiceService {
  private modalSubject = new Subject<ClientFormModalState>();
  private submitSubject = new Subject<Partial<IClient>>();

  constructor() {}

  open(client: IClient | null = null): void {
    this.modalSubject.next({ show: true, client });
  }

  close(): void {
    this.modalSubject.next({ show: false });
  }

  getModalState(): Observable<ClientFormModalState> {
    return this.modalSubject.asObservable();
  }

  submitClient(client: Partial<IClient>): void {
    this.submitSubject.next(client);
  }

  getSubmitObservable(): Observable<Partial<IClient>> {
    return this.submitSubject.asObservable();
  }
}
