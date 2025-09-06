import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messageService = inject(MessageService);

  clearError() {
    this.messageService.clear('error');
  }

  info(summary: string, detail: string = '', key = 'default') {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      key,
      life: 3000
    });
  }

  success(summary: string, detail: string = '', key = 'default') {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      key,
      life: 3000
    });
  }

  warn(summary: string, detail: string = '', key = 'default') {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      key,
      life: 3000
    });
  }

  error(summary: any, detail: string = '', key = 'default') {
    let message = '';
    if (typeof summary === 'object' && summary.error) {
      message = summary.error.errors;
    } else if (typeof summary === 'string') {
      message = summary;
    } else {
      message = 'Có lỗi xảy ra';
    }

    this.messageService.add({
      severity: 'error',
      summary: message,
      detail,
      key,
      life: 3000
    });
  }

  add(
    type: string,
    summary: string,
    detail: string = '',
    key = 'default',
    sticky = false
  ) {
    this.messageService.add({
      key,
      severity: type,
      summary,
      detail,
      sticky,
      life: sticky ? undefined : 3000
    });
  }
}
