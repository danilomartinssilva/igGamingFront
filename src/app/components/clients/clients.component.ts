import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Api, Config } from 'datatables.net';
import { Subject } from 'rxjs';
import { ClientService } from '../../services/clients/client.service';
import { IClient } from '../../app/types/IClients';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionLockClosed,
  ionLockOpen,
  ionRemove,
  ionTrash,
  ionCheckmarkCircle,
} from '@ng-icons/ionicons';
import {
  ModalConfirmServiceService,
  ModalData,
} from '../../services/modalConfirmService/modal-confirm-service.service';
import { AddClientsComponent } from '../add-clients/add-clients.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [DataTablesModule, CommonModule, NgIcon, AddClientsComponent],
  viewProviders: [
    provideIcons({
      ionLockClosed,
      ionLockOpen,
      ionRemove,
      ionTrash,
      ionCheckmarkCircle,
    }),
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit, OnDestroy {
  dtOptions: Config = {};

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  private readonly clientService = inject(ClientService);
  private readonly modalServiceConfirm = inject(ModalConfirmServiceService);
  private currentUserToDelete: IClient | null = null;

  clients: IClient[] = [];
  loading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers', // Estilo de paginação
      destroy: true,
      pageLength: 20, // Número de itens por página
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json',
      },
    };
    this.fetchData();

    this.modalServiceConfirm.getResult().subscribe((result) => {
      if (result && this.currentUserToDelete) {
        this.handleRemoveClient();
      }
    });
  }

  fetchData(): void {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
        this.dtTrigger.next(null);
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }

  handleRemoveClient(): void {
    if (this.currentUserToDelete?.id === undefined) return;

    this.clientService.removeClient(this.currentUserToDelete.id).subscribe({
      next: () => {
        this.clients = this.clients.filter(
          (client) => client.id !== this.currentUserToDelete?.id
        );
        this.rerender();
      },
    });
  }

  callModalConfirmRemove(client: IClient): void {
    const modalData: ModalData = {
      message: `Deseja realmente excluir o usuário "${client.name}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
    };

    this.currentUserToDelete = client;
    this.modalServiceConfirm.show(modalData);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
