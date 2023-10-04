import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() firstLetterSelected = new EventEmitter<string>();

  firstLetter: string = '';

  search() {
    if (this.firstLetter) {
      this.firstLetterSelected.emit(this.firstLetter.toUpperCase());
    }
  }
}
