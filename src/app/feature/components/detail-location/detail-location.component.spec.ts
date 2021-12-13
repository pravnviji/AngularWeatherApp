import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailLocationComponent} from './detail-location.component';

describe('DetailLocationComponent', () => {
  let component: DetailLocationComponent;
  let fixture: ComponentFixture<DetailLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailLocationComponent],
    })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
