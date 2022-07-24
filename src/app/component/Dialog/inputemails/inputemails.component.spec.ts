import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputemailsComponent } from './inputemails.component';

describe('InputemailsComponent', () => {
  let component: InputemailsComponent;
  let fixture: ComponentFixture<InputemailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputemailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputemailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
