import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConcursodPage } from './concursod.page';

describe('ConcursodPage', () => {
  let component: ConcursodPage;
  let fixture: ComponentFixture<ConcursodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcursodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConcursodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
