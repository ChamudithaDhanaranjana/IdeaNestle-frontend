import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormattingUtilService {

  formatDate(localDate: number[]): string {
    const [year, month, day] = localDate;
    return `${day} - ${month} - ${year}`;
  }
}
