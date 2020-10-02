import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComprasmpPage } from './comprasmp.page';

describe('ComprasmpPage', () => {
  let component: ComprasmpPage;
  let fixture: ComponentFixture<ComprasmpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasmpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComprasmpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
