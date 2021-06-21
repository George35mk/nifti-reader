import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiftiFileInfoComponent } from './nifti-file-info.component';

describe('NiftiFileInfoComponent', () => {
  let component: NiftiFileInfoComponent;
  let fixture: ComponentFixture<NiftiFileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NiftiFileInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NiftiFileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
