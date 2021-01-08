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

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    this.getSortType();
  }

  getSortType(): void {
    this.appService.getSortType()
      .subscribe(t => this.typeList = t);
  }

}
