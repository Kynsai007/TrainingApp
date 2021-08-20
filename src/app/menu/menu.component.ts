import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  all:boolean = true;
  favourite:boolean = false;
  settings:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  navigate(item:string): void {
    if(item == 'all'){
      this.all = true;
      this.favourite = false;
      this.settings = false;
    }else if(item == 'favourite'){
      this.all = false;
      this.favourite = true;
      this.settings = false;
    }else{
      this.all = false;
      this.favourite = false;
      this.settings = true;
    }
  }
}
