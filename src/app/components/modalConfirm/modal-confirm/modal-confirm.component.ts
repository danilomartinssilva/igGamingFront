import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ModalConfirmServiceService,
  ModalData,
} from '../../../services/modalConfirmService/modal-confirm-service.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.css',
})
export class ModalConfirmComponent implements OnInit {
  isVisible: boolean = false;
  modalData: ModalData = {
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
  };
  private modalService = inject(ModalConfirmServiceService);
  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  private modalSubscription!: Subscription;

  ngOnInit(): void {
    this.modalSubscription = this.modalService
      .getModalState()
      .subscribe((state) => {
        this.isVisible = state.show;
        if (state.data) {
          this.modalData = { ...this.modalData, ...state.data };
        }
      });
  }

  getConfirmButtonClass(): string {
    switch (this.modalData.type) {
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-info';
      case 'danger':
      default:
        return 'btn-danger';
    }
  }

  close(): void {
    this.modalService.setResult(false);
    this.modalService.close();
  }
  confirm(): void {
    this.modalService.setResult(true);
    this.modalService.close();
  }
}
