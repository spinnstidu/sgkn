import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRouterParamComponent } from './get-router-param.component';

describe('GetRouterParamComponent', () => {
  let component: GetRouterParamComponent;
  let fixture: ComponentFixture<GetRouterParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetRouterParamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetRouterParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
