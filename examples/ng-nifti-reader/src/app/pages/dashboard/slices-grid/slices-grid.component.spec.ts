import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlicesGridComponent } from './slices-grid.component';

describe('SlicesGridComponent', () => {
  let component: SlicesGridComponent;
  let fixture: ComponentFixture<SlicesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlicesGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlicesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
