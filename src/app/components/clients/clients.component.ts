import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientService } from '../../services/clients/client.service';
import { IClient, IPage } from '../../app/types/IClients';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionLockClosed,
  ionLockOpen,
  ionTrash,
  ionCheckmarkCircle,
  ionChevronBack,
  ionChevronForward,
} from '@ng-icons/ionicons';
import {
  ModalConfirmServiceService,
  ModalData,
} from '../../services/modalConfirmService/modal-confirm-service.service';
import { AddClientsComponent } from '../add-clients/add-clients.component';
import { ClientFormModalServiceService } from '../../services/clientFormModalService/client-form-modal-service.service';
import { FormsModule } from '@angular/forms';
import { ClientsDetailModalComponentComponent } from '../clientsDetailModalCompoment/clients-detail-modal-component/clients-detail-modal-component.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    AddClientsComponent,
    FormsModule,
    ClientsDetailModalComponentComponent,
  ],
  viewProviders: [
    provideIcons({
      ionLockClosed,
      ionLockOpen,
      ionTrash,
      ionCheckmarkCircle,
      ionChevronBack,
      ionChevronForward,
    }),
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit, OnDestroy {
  private readonly clientService = inject(ClientService);
  private readonly clientFormModalService = inject(
    ClientFormModalServiceService
  );
  private readonly modalServiceConfirm = inject(ModalConfirmServiceService);

  private clientsSubscription!: Subscription;
  private currentUserToDelete: IClient | null = null;

  clients: IClient[] = [];
  paginationData: IPage<IClient> | null = null;

  loading: boolean = true;
  error: string = '';
  showFormModal: boolean = false;
  selectedClient: IClient | null = null;
  formLoading: boolean = false;

  currentPage: number = 0;
  pageSize: number = 10;
  pageSizes: number[] = [5, 20, 50, 100];

  showDetailsModal: boolean = false;
  detailsLoading: boolean = false;

  ngOnInit(): void {
    this.subscribeToClients();
    this.subscribeToModals();
  }

  private subscribeToClients(): void {
    this.clientsSubscription = this.clientService.clients$.subscribe({
      next: (paginationData) => {
        this.paginationData = paginationData;
        this.clients = paginationData?.content || [];
        this.loading = false;
        this.error = '';
      },
      error: (error) => {
        this.error = 'Erro ao carregar clientes';
        this.loading = false;
        console.error('Erro:', error);
      },
    });
  }

  private subscribeToModals(): void {
    this.modalServiceConfirm.getResult().subscribe((result) => {
      if (result && this.currentUserToDelete) {
        this.handleRemoveClient();
      }
    });

    this.clientFormModalService.getModalState().subscribe((state) => {
      this.showFormModal = state.show;
      this.selectedClient = state.client || null;
    });
  }

  changePage(page: number): void {
    this.loading = true;
    this.currentPage = page;
    this.clientService.getPaginatedClients(page, this.pageSize).subscribe({
      error: (error) => {
        this.loading = false;
        console.error('Erro ao mudar página:', error);
      },
    });
  }

  changePageSize(size: number): void {
    this.loading = true;
    this.pageSize = size;
    this.currentPage = 0;
    this.clientService.getPaginatedClients(0, size).subscribe({
      error: (error) => {
        this.loading = false;
        console.error('Erro ao mudar tamanho da página:', error);
      },
    });
  }

  nextPage(): void {
    if (this.paginationData && !this.paginationData.last) {
      this.changePage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.changePage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    if (!this.paginationData) return [];

    const totalPages = this.paginationData.totalPages;
    const currentPage = this.currentPage;
    const pages: number[] = [];

    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages, start + 5);

    if (end - start < 5) {
      start = Math.max(0, end - 5);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }

  handleRemoveClient(): void {
    if (this.currentUserToDelete?.id === undefined) return;

    this.clientService.removeClient(this.currentUserToDelete.id).subscribe({
      next: () => {
        this.refreshData();
      },
      error: (error) => {
        console.error('Erro ao excluir cliente:', error);
      },
    });
  }

  callModalConfirmRemove(client: IClient): void {
    const modalData: ModalData = {
      message: `Deseja realmente excluir o cliente "${client.name}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
    };

    this.currentUserToDelete = client;
    this.modalServiceConfirm.show(modalData);
  }

  handleFormSubmit(clientData: Partial<IClient>): void {
    this.formLoading = true;

    if (this.selectedClient && this.selectedClient.id) {
      this.clientService
        .updateClient({ ...clientData, id: this.selectedClient.id })
        .subscribe({
          next: () => {
            this.formLoading = false;
            this.closeFormModal();
            this.refreshData();
          },
          error: (error) => {
            console.error('Erro ao atualizar cliente:', error);
            this.formLoading = false;
          },
        });
    } else {
      this.clientService.addClient(clientData).subscribe({
        next: () => {
          this.formLoading = false;
          this.closeFormModal();
          this.refreshData();
        },
        error: (error) => {
          console.error('Erro ao criar cliente:', error);
          this.formLoading = false;
        },
      });
    }
  }

  refreshData(): void {
    this.loading = true;
    this.clientService
      .refreshClients(this.currentPage, this.pageSize)
      .subscribe({
        error: (error) => {
          this.loading = false;
          console.error('Erro ao atualizar dados:', error);
        },
      });
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.selectedClient = null;
    this.clientFormModalService.close();
  }

  openCreateFormModal(): void {
    this.clientFormModalService.open();
  }

  editClientForm(client: IClient): void {
    this.clientFormModalService.open(client);
  }

  viewClientDetails(client: IClient) {
    this.selectedClient = client;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedClient = null;
  }
  ngOnDestroy(): void {
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }
}
