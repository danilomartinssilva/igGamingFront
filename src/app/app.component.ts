import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalConfirmComponent } from './components/modalConfirm/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalConfirmComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'igamingFront';
}
