import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'newExamQs';
  typeList: object[];
  id: string;
  name: string;

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.getSortType();
  }

  getSortType(): void {
    this.appService.getSortType()
      .subscribe(t => {
        this.typeList = t;
        this.id = '1';
        // @ts-ignore
        this.name = t[0].child[0].name;
        this.getQuesData();
      });
  }

  getQuesData(): void {
    this.appService.getQuesData({id: this.id, name: this.name})
      .subscribe(t => console.log(t));
  }
}
