// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { MostReadNewsComponent } from './most-read-news.component';

// describe('MostReadNewsComponent', () => {
//   let component: MostReadNewsComponent;
//   let fixture: ComponentFixture<MostReadNewsComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [MostReadNewsComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(MostReadNewsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MostReadNewsComponent } from './most-read-news.component';

describe('MostReadNewsComponent', () => {
  let component: MostReadNewsComponent;
  let fixture: ComponentFixture<MostReadNewsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostReadNewsComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MostReadNewsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch most read news from API', () => {
    const mockNews = [
      {
        id: 1,
        baslik: 'Test Haber',
        icerik: 'Test içerik',
        resimUrl: null,
        yayinTarihi: '2025-07-08T09:52:59',
        onaylandi: true,
        kategoriId: 1,
        okunmaSayisi: 24,
        tiklanmaSayisi: 45
      }
    ];

    fixture.detectChanges(); // ngOnInit tetiklenir
    const req = httpMock.expectOne('http://api.example.com/haberler');
    expect(req.request.method).toBe('GET');
    req.flush(mockNews);

    expect(component.mostReadNews.length).toBe(1);
    expect(component.mostReadNews[0].baslik).toBe('Test Haber');
  });
});