import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdministraccioncontraPage } from './administraccioncontra.page';

describe('AdministraccioncontraPage', () => {
  let component: AdministraccioncontraPage;
  let fixture: ComponentFixture<AdministraccioncontraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministraccioncontraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministraccioncontraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
