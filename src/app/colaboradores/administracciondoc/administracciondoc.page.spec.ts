import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdministracciondocPage } from './administracciondoc.page';

describe('AdministracciondocPage', () => {
  let component: AdministracciondocPage;
  let fixture: ComponentFixture<AdministracciondocPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracciondocPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministracciondocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
