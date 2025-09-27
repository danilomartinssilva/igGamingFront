import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IClient } from '../../../app/types/IClients';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionCalendar,
  ionCall,
  ionCard,
  ionCloseCircle,
  ionLockClosed,
  ionLockOpen,
  ionMail,
  ionPerson,
  ionPersonCircle,
  ionTime,
  ionWarning,
} from '@ng-icons/ionicons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients-detail-modal-component',
  standalone: true,
  imports: [CommonModule, NgIcon],
  viewProviders: [
    provideIcons({
      ionPerson,
      ionCloseCircle,
      ionMail,
      ionCall,
      ionCalendar,
      ionCard,
      ionTime,
      ionLockOpen,
      ionLockClosed,
      ionWarning,
      ionPersonCircle,
    }),
  ],
  templateUrl: './clients-detail-modal-component.component.html',
  styleUrl: './clients-detail-modal-component.component.css',
})
export class ClientsDetailModalComponentComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() client: IClient | null = null;
  @Input() loading: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<IClient>();

  close() {
    this.onClose.emit();
  }
  ngOnInit(): void {}

  editClient() {
    if (this.client) {
      this.onEdit.emit(this.client);
    }
  }
}
