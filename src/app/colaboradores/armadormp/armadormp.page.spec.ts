import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArmadormpPage } from './armadormp.page';

describe('ArmadormpPage', () => {
  let component: ArmadormpPage;
  let fixture: ComponentFixture<ArmadormpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmadormpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArmadormpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
