import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoDashComponent } from './crypto-dash.component';

describe('CryptoDashComponent', () => {
  let component: CryptoDashComponent;
  let fixture: ComponentFixture<CryptoDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
