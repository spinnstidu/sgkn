import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';

export interface DialogData {
  title:string,
  content:string,
  emails:string[]
  // animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-inputemails',
  templateUrl: './inputemails.component.html',
  styleUrls: ['./inputemails.component.css']
})
export class InputemailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  InputEmails=''
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON] as const;
  ngOnInit(): void {
  }
  addtheseemail(){
    console.log('enter');
    
    this.InputEmails = this.InputEmails.trim()
    let list = this.InputEmails.split(';')
    for(let email of list)
    {
      email = email.trim();
      this.data.emails.push(email)
    }
    this.InputEmails = ''
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.data.emails.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email: string): void {
    const index = this.data.emails.indexOf(email);

    if (index >= 0) {
      this.data.emails.splice(index, 1);
    }
  }
}
