import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoBrowserComponent } from './crypto-browser.component';

describe('CryptoBrowserComponent', () => {
  let component: CryptoBrowserComponent;
  let fixture: ComponentFixture<CryptoBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoBrowserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
