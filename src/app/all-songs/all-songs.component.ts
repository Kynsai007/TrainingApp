import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-songs',
  templateUrl: './all-songs.component.html',
  styleUrls: ['./all-songs.component.css']
})
export class AllSongsComponent implements OnInit {
  allsongs:any;
  num_blocks: number = 0;
	ready:boolean=false;
  in_scene_arr:any[] = [];
  start_pos: number = 0;
  end_pos: number = 3;
  last_difference:number = 0;
  // position of current item in view
	current: number = 1;
  constructor(private http:HttpClient,private el:ElementRef,private changeDetect:ChangeDetectorRef) { }

  async ngOnInit(){
    this.allsongs = await this.http.get("https://jsonplaceholder.typicode.com/photos").toPromise();
    this.ready = true;
    this.changeDetect.detectChanges();
    this.addEvent();
    this.num_blocks = Math.ceil(this.allsongs.length/3);
    this.last_difference = this.allsongs.length - this.closestNumber(this.allsongs.length,3);
  }
  counter(range:number){
    let num_array = [];
    for(let i = 1;i<=range;i++){
      num_array.push(i)
    }
    return num_array;
  }
  addEvent(){
    let _this = this;
    this.el.nativeElement.querySelector("#flex-container").addEventListener('transitionend',_this.changeOrder('init'));
  }
    
  
  
  
  gotoNext(){
    this.changeOrder('next');
  }
  gotoPrevious(){
    this.changeOrder('previous')
  }
  closestNumber(n:number, m:number){
    let q = n / m;
    let n1 = m * Math.floor(q);
    return n1;
}
  changeOrder(action:string){
    
		// change current position
		let order = 1;

		// change order from current position till last
		for(let i=this.current; i<=this.num_blocks; i++) {
			this.el.nativeElement.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
			order++;
		}

		// change order from first position till current
		for(let i=1; i<this.current; i++) {
			this.el.nativeElement.querySelector(".slider-item[data-position='" + i + "']").style.order = order;
			order++;
		}

		// translate back to 0 from -100%
		// we don't need transitionend to fire for this translation, so remove transition CSS
		this.in_scene_arr = [];
      
    if(action == 'next'){
      this.current++;
      this.end_pos = this.current * 3;
      this.start_pos = this.end_pos - 3;
      if(this.current == this.num_blocks){
        this.end_pos = this.allsongs.length;
      }
      if(this.current > this.num_blocks){
        this.current = 1;
        this.start_pos = 0;
        this.end_pos = 3;
      }
      this.el.nativeElement.querySelector("#flex-container").classList.add('slider-container-transition');
      this.el.nativeElement.querySelector("#flex-container").style.transform = 'translateX(-100%)';
    }
    if(action == 'previous'){
      this.current--;

      if(this.current == 0)
			{
        this.current = this.num_blocks;
        this.end_pos = this.allsongs.length;
        this.start_pos = this.end_pos - this.last_difference;        
      }else{
        this.end_pos = this.start_pos;
        this.start_pos = this.end_pos - 3;
      }
      this.el.nativeElement.querySelector("#flex-container").classList.add('slider-container-transition');
      this.el.nativeElement.querySelector("#flex-container").style.transform = 'translateX(-100%)';
    }
    for(let j = this.start_pos;j< this.end_pos;j++){
      this.in_scene_arr.push(this.allsongs[j])
    }
    //this.el.nativeElement.querySelector("#flex-container").classList.remove('slider-container-transition');
    //this.el.nativeElement.querySelector("#flex-container").style.transform = 'translateX(0)';
        
  }
}
