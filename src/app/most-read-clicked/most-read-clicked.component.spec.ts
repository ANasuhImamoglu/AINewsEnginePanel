import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostReadClickedComponent } from './most-read-clicked.component';

describe('MostReadClickedComponent', () => {
  let component: MostReadClickedComponent;
  let fixture: ComponentFixture<MostReadClickedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostReadClickedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostReadClickedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
