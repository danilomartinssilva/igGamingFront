import { Component, OnInit } from '@angular/core';
import { Alert, AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-error.component.html',
  styleUrl: './alert-error.component.css',
})
export class AlertErrorComponent implements OnInit {
  alerts: Alert[] = [];

  ngOnInit() {
    AlertService.alerts$.subscribe((alerts) => {
      this.alerts = alerts;
    });
  }

  closeAlert(id: string) {
    AlertService.clearAlerts();
  }
}
