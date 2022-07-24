import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompletetitleComponent } from './autocompletetitle.component';

describe('AutocompletetitleComponent', () => {
  let component: AutocompletetitleComponent;
  let fixture: ComponentFixture<AutocompletetitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompletetitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompletetitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
