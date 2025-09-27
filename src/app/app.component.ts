import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalConfirmComponent } from './components/modalConfirm/modal-confirm/modal-confirm.component';
import { AlertErrorComponent } from './components/alert/alert-error/alert-error.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalConfirmComponent, AlertErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'igamingFront';
}
