import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostClickedNewsComponent } from './most-clicked-news.component';

describe('MostClickedNewsComponent', () => {
  let component: MostClickedNewsComponent;
  let fixture: ComponentFixture<MostClickedNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostClickedNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostClickedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
