import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule, ToastPositionType } from 'primeng/toast';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'lib-notification',
  imports: [
    CommonModule,
    ToastModule,
    RippleModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  @Input() position: ToastPositionType = 'top-right';
  @Input() key = 'default';

  private notification: NotificationService = inject(NotificationService);

  constructor(
    // private messageService: MessageService,
    // private primengConfig: PrimeNGConfig,

  ) { }

  ngOnInit() {
    // this.primengConfig.ripple = true;
  }

  onConfirm() {
    this.notification.clearError();
  }
}
