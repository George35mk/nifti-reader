import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiftiHeaderSectionComponent } from './nifti-header-section.component';

describe('NiftiHeaderSectionComponent', () => {
  let component: NiftiHeaderSectionComponent;
  let fixture: ComponentFixture<NiftiHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiftiHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiftiHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
