import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicdialogComponent } from './publicdialog.component';

describe('PublicdialogComponent', () => {
  let component: PublicdialogComponent;
  let fixture: ComponentFixture<PublicdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
