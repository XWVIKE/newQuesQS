import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'newExamQs';
  typeList: object[];
  id: string;
  name: string;
  selectType: string;
  loading: boolean;
  quesTitle: string;
  sortNum = 1;
  totalNum: number;

  constructor(private appService: AppService, private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.getSortType();
  }

  jump(): void {
    window.open('chrome://dino/', '_blank');
  }

  search(e: string): void {
    this.sortNum = +e <= 1 ? 1 : +e >= this.totalNum ? this.totalNum : +e;
    this.getQuesData();
  }

  nextQues(e: boolean): void {
    const num = e ? this.sortNum + 1 : this.sortNum - 1;
    if (num <= 0 || num >= this.totalNum + 1) {
      this.message.info(`已是${num <= 0 ? '第' : '最后'}一道题`);
      return;
    }
    this.sortNum = num;
    this.getQuesData();
  }

  setSelectType(e: string): void {
    this.selectType = e;
    this.getQuesData();
  }

  getSortType(): void {
    this.appService.getSortType()
      .subscribe(t => {
        this.typeList = t;
        this.sortNum = 1;
        this.selectType = (t[0] as any).child[0].name;
        this.getQuesData();
      });
  }

  getQuesData(): void {
    this.loading = true;
    this.appService.getQuesData({sortNum: this.sortNum, name: this.selectType})
      .subscribe(t => {
        this.loading = false;
        this.totalNum = (t as any).TotalNum;
        this.quesTitle = (t as any).edit_parse_new[0].exam_name;
        console.log(t);
      });
  }
}
