import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Nav3Component } from './nav3.component';

describe('Nav3Component', () => {
  let component: Nav3Component;
  let fixture: ComponentFixture<Nav3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Nav3Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Nav3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
