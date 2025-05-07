import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScategoryModalComponent } from './edit-scategory-modal.component';

describe('EditScategoryModalComponent', () => {
  let component: EditScategoryModalComponent;
  let fixture: ComponentFixture<EditScategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditScategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
