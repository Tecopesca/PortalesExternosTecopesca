import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Input() x = 0;
  @Input() y = 0;
  @Input() isShow: boolean;
  constructor() { }

  ngOnInit() {
  }

  public onLock(e): void {
    console.log('lock');
    this.isShow=false;
  }

  public onUnLock(e): void {
    console.log('unlock');
  }
  
}
