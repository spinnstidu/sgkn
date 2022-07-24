import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountadminComponent } from './accountadmin.component';

describe('AccountadminComponent', () => {
  let component: AccountadminComponent;
  let fixture: ComponentFixture<AccountadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
