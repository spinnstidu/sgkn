import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglearticleinfoComponent } from './singlearticleinfo.component';

describe('SinglearticleinfoComponent', () => {
  let component: SinglearticleinfoComponent;
  let fixture: ComponentFixture<SinglearticleinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglearticleinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglearticleinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
