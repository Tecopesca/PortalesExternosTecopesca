import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArmadormpdosPage } from './armadormpdos.page';

describe('ArmadormpdosPage', () => {
  let component: ArmadormpdosPage;
  let fixture: ComponentFixture<ArmadormpdosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmadormpdosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArmadormpdosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
