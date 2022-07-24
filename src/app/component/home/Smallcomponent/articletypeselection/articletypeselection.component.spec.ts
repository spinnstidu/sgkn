import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticletypeselectionComponent } from './articletypeselection.component';

describe('ArticletypeselectionComponent', () => {
  let component: ArticletypeselectionComponent;
  let fixture: ComponentFixture<ArticletypeselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticletypeselectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticletypeselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
