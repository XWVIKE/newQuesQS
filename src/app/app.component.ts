import {Component, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {tap, map, catchError} from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {jsonToHtml} from '../assets/js/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'newExamQs';
  typeList: object[];
  quesId: string;
  name: string;
  selectType: string;
  loading: boolean;
  quesTitle: string;
  sortNum = 1;
  totalNum: number;
  tab = 0;
  questionStem = [];
  questionMaterial = [];
  options = [];
  problemList = [];
  quesTrue = '0';
  editorContent = '';
  parseList = [
    {label: '某笔解析', data: [], edit: []},
    {label: '某图解析', data: [], edit: []},
    {label: '某果解析', data: [], edit: []},
    {label: '某公解析', data: [], edit: []},
    {label: '新途径解析', data: [], edit: []},
  ];

  constructor(
    private appService: AppService,
    private message: NzMessageService
  ) {
  }

  editorConfig = {
    height: 200,
    language: 'zh_CN',
    entity_encoding: 'raw',
    automatic_uploads: false,
    images_upload_handler: (blobInfo, success, failure) => {
      const formData = new FormData();
      formData.append('bucketName', 'duojie');
      formData.append('file', blobInfo.blob());
      this.appService.uploadImg(formData, {'Content-Type': 'multipart/form-data'}).pipe(
        tap(t => {
          success(t.url.split('?')[0]);
        }),
        catchError(t => failure(t))
      )
        .subscribe();
    },
    language_url: 'https://lab.uxfeel.com/node_modules/tinymce/langs/zh_CN.js',
    menubar: false,
    toolbar: 'image wordcount code preview',
    toolbar_drawer: 'sliding',
    plugins: 'preview wordcount link image imagetools code',
  };

  ngOnInit(): void {
    this.getSortType();
  }

  changeTab(e): void {
    this.tab = e;
    console.log(this.parseList[e].edit);
    this.editorContent = jsonToHtml(this.parseList[e].edit);
  }

  jump(): void {
    window.open('chrome://dino/', '_blank');
  }

  // tslint:disable-next-line:typedef
  moveOption(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
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

  getQuesProblem(): void {
    this.appService.getQuesProblem(this.quesId).subscribe(t => {
      this.problemList = t || [];
    });
  }

  getSortType(): void {
    this.appService.getSortType().subscribe((t) => {
      this.typeList = t;
      this.sortNum = 1;
      this.selectType = (t[0] as any).child[0].name;
      this.getQuesData();
    });
  }

  getQuesData(): void {
    this.loading = true;
    this.appService
      .getQuesData({sortNum: this.sortNum, name: this.selectType})
      .pipe(
        // 获取资料
        tap((t) => {
          if ((t as any).edit_parse_new[0].material !== undefined) {
            this.questionMaterial = (t as any).edit_parse_new[0].material || [];
          } else {
            this.questionMaterial = [];
          }
        }),
        // 获取某笔解析
        tap(t => {
          const parsingOne = (t as any).edit_parse_new[0].parsing_one || undefined;
          const oneContent = (t as any).edit_parse_new[0].OneContent || `[]`;
          if (parsingOne !== undefined) {
            this.parseList[0].data = parsingOne;
          } else {
            this.parseList[0].data = JSON.parse(oneContent);
          }
          this.parseList[0].edit = JSON.parse(oneContent);
          this.editorContent = jsonToHtml(JSON.parse(oneContent));
        }),
        // 获取某图解析
        tap(t => {
          const parsingTwo = (t as any).edit_parse_new[0].parsing_two || undefined;
          const twoContent = (t as any).edit_parse_new[0].TwoContent || `[]`;
          if (parsingTwo !== undefined) {
            this.parseList[1].data = parsingTwo;
          } else {
            this.parseList[1].data = JSON.parse(twoContent);
          }
          this.parseList[1].edit = JSON.parse(twoContent);
        }),
        // 获取某果解析
        tap(t => {
          const parsingThr = (t as any).edit_parse_new[0].parsing_thr || undefined;
          const thrContent = (t as any).edit_parse_new[0].thrContent || `[]`;
          if (parsingThr !== undefined) {
            this.parseList[2].data = parsingThr;
          } else {
            this.parseList[2].data = JSON.parse(thrContent);
          }
          this.parseList[2].edit = JSON.parse(thrContent);
        }),
        // 获取某公解析
        tap(t => {
          const parsingFou = (t as any).edit_parse_new[0].parsing_fou || undefined;
          const fouContent = (t as any).edit_parse_new[0].fouContent || `[]`;
          if (parsingFou !== undefined) {
            this.parseList[3].data = parsingFou;
          } else {
            this.parseList[3].data = JSON.parse(fouContent);
          }
          this.parseList[3].edit = JSON.parse(fouContent);
        }),
        // 获取新途径解析
        tap(t => {
          const parsingXtj = (t as any).edit_parse_new[0].parsing_xtj || undefined;
          if (parsingXtj !== undefined) {
            this.parseList[4].data = parsingXtj;
          } else {
            this.parseList[4].data = [];
          }
        })
      )
      .subscribe((t) => {
        this.loading = false;
        this.quesId = (t as any).edit_parse_new[0].ques_id;
        this.totalNum = (t as any).TotalNum;
        this.quesTitle = (t as any).edit_parse_new[0].exam_name;
        this.questionStem = (t as any).edit_parse_new[0].title;
        this.options = (t as any).edit_parse_new[0].options;
        this.getQuesProblem();
        console.log(t);
      });
  }
}
