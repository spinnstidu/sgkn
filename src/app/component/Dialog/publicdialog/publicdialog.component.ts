import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';

export interface DialogData {
  title:string,
  content:string
  // animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-publicdialog',
  templateUrl: './publicdialog.component.html',
  styleUrls: ['./publicdialog.component.css']
})
export class PublicdialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}

// this.dialog.open(PublicdialogComponent, {
//   data:{
//     title:'Error!',
//     content: this.savingmessage
//   }
// });