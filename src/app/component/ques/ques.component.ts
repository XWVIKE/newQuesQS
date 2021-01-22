import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, tap } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { toHtml } from '../../../assets/js/utils';
import { Router } from '@angular/router';
import { EditpasswordComponent } from './dialog/editpassword.dialog';

@Component({
  selector: 'app-ques',
  templateUrl: './ques.component.html',
  styleUrls: ['./ques.component.scss']
})
export class QuesComponent implements OnInit {

  title = 'newExamQs';
  typeList: object[];
  quesId = '0';
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
  moreNum = 1;
  showProblemList = [];
  quesTrue = '0';
  editorContent = '';
  isVisible = false;
  problemType = '重复问题'; // 问题反馈类型
  problemText = ''; // 问题反馈详细描述
  quill: any;
  parseList = [
    { label: '某笔解析', data: '[]', edit: [], error: false },
    { label: '某图解析', data: '[]', edit: [], error: false },
    { label: '某果解析', data: '[]', edit: [], error: false },
    { label: '某公解析', data: '[]', edit: [], error: false },
    { label: '新途径解析', data: '[]', edit: [], error: false },
  ];
  userName = localStorage.getItem('name') || '';
  avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
  constructor(
    private appService: AppService,
    private message: NzMessageService,
    private modal: NzModalService,
    private router: Router
  ) {
  }

  editorConfig = {
    height: 500,
    language: 'zh_CN',
    entity_encoding: 'raw',
    automatic_uploads: false,
    images_upload_handler: (blobInfo, success, failure) => {
      const formData = new FormData();
      formData.append('bucketName', 'duojie');
      formData.append('file', blobInfo.blob());
      this.appService.uploadImg(formData, { 'Content-Type': 'multipart/form-data' }).pipe(
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

  more(): void {
    if (this.problemList.length <= 1) {
      this.message.info('只有一个问题反馈没有更多了');
      return;
    }
    if (this.moreNum === 1) {
      this.showProblemList = this.problemList;
      this.moreNum = 2;
    } else {
      this.showProblemList = this.problemList.slice(0, 1);
      this.moreNum = 1;
    }
  }

  switchError(e): void {
    this.parseList[this.tab].error = e;
    const status = e ? '2' : '1';
    const data = {
      num: this.tab + 1,
      quesId: this.quesId,
      status,
    };
    this.appService.record(data).subscribe(t => {
      this.message.success('修改成功');
    });
  }

  /**
   * 更新解析
   */
  updateParse(): void {
    const html = this.parseList[this.tab].edit;
    this.modal.confirm({
      nzTitle: '确定保存此次更改？',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        if (this.tab < 4) {
          const arr = ['某笔解析', '某图解析', '某果解析', '某公解析'];
          const data = {
            num: this.tab + 1,
            name: arr[this.tab],
            quesId: this.quesId,
            content: html,
          };
          this.appService.updateParse(data).subscribe(_ => {
            this.message.success('成功');
            this.getQuesData();
          });
        } else {
          const data = {
            quesId: this.quesId,
            content: html,
          };
          this.appService.addParse(data).subscribe(t => {
            this.message.success('成功');
            this.getQuesData();
          });
        }
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  /**
   * 取消反馈
   */
  handleCancel(): void {
    this.isVisible = false;
  }

  /**
   * 确定提交反馈
   */
  handleOk(): void {
    if (this.problemText === '') {
      this.message.error('请详细描述问题');
      return;
    }
    this.modal.confirm({
      nzTitle: '确定提交该问题反馈?',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const data = {
          quesId: this.quesId,
          quesType: this.problemType,
          content: this.problemText
        };
        this.appService.addQuesProblem(data).subscribe(
          t => {
            this.getQuesProblem();
            this.isVisible = false;
            this.problemText = '';
          }
        );
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  /**
   *  显示反馈对话框
   */
  showModal(): void {
    this.isVisible = true;
  }

  /**
   * 切换解析tab
   */
  changeTab(e): void {
    this.tab = e;
  }

  jump(): void {
    window.open('chrome://dino/', '_blank');
  }

  /**
   * 拖动选项
   */
  // tslint:disable-next-line:typedef
  moveOption(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
    const arr = this.options;
    const data = {
      sort: arr,
      quesId: this.quesId,
    };
    this.appService.updateOption(data).subscribe(t => {
      this.message.success('排序成功');
    });
  }

  /**
   * 搜索题目
   */
  search(e: string): void {
    this.sortNum = +e <= 1 ? 1 : +e >= this.totalNum ? this.totalNum : +e;
    this.getQuesData();
  }

  /**
   * 下一题or上一题
   */
  nextQues(e: boolean): void {
    const num = e ? this.sortNum + 1 : this.sortNum - 1;
    if (num <= 0 || num >= this.totalNum + 1) {
      this.message.info(`已是${num <= 0 ? '第' : '最后'}一道题`);
      return;
    }
    this.sortNum = num;
    this.getQuesData();
  }

  /**
   * 选择分类
   */
  setSelectType(e: string): void {
    this.selectType = e;
    this.sortNum = 1;
    this.getQuesData();
  }

  /**
   * 获取问题反馈
   */
  getQuesProblem(): void {
    this.appService.getQuesProblem(this.quesId).subscribe(t => {
      this.problemList = t || [];
      this.showProblemList = this.problemList.slice(0, 1) || [];
    });
  }

  /**
   * 获取题目分类
   */
  getSortType(): void {
    this.appService.getSortType().subscribe((t) => {
      this.typeList = t;
      this.sortNum = 1;
      this.selectType = (t[0] as any).child[0].name;
      this.getQuesData();
    });
  }

  /**
   * 获取题目数据
   */
  getQuesData(): void {
    this.loading = true;
    this.appService
      .getQuesData({ sortNum: this.sortNum, name: this.selectType })
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
            this.parseList[0].data = oneContent;
          }
          this.parseList[0].edit = toHtml(oneContent);
          this.parseList[0].error = (t as any).edit_parse_new[0].isRightOne || false;
        }),
        // 获取某图解析
        tap(t => {
          const parsingTwo = (t as any).edit_parse_new[0].parsing_two || undefined;
          const twoContent = (t as any).edit_parse_new[0].twoContent || `[]`;
          if (parsingTwo !== undefined) {
            this.parseList[1].data = parsingTwo;
          } else {
            this.parseList[1].data = twoContent;
          }
          this.parseList[1].edit = toHtml(twoContent);
          this.parseList[1].error = (t as any).edit_parse_new[0].isRightTwo || false;
        }),
        // 获取某果解析
        tap(t => {
          const parsingThr = (t as any).edit_parse_new[0].parsing_thr || undefined;
          const thrContent = (t as any).edit_parse_new[0].thrContent || `[]`;
          if (parsingThr !== undefined) {
            this.parseList[2].data = parsingThr;
          } else {
            this.parseList[2].data = thrContent;
          }
          this.parseList[2].edit = toHtml(thrContent);
          this.parseList[2].error = (t as any).edit_parse_new[0].isRightThr || false;
        }),
        // 获取某公解析
        tap(t => {
          const parsingFou = (t as any).edit_parse_new[0].parsing_fou || undefined;
          const fouContent = (t as any).edit_parse_new[0].fouContent || `[]`;
          if (parsingFou !== undefined) {
            this.parseList[3].data = parsingFou;
          } else {
            this.parseList[3].data = fouContent;
          }
          this.parseList[3].edit = toHtml(fouContent);
          this.parseList[3].error = (t as any).edit_parse_new[0].isRightFou || false;
        }),
        // 获取新途径解析
        tap(t => {
          const parsingXtj = (t as any).edit_parse_new[0].parsing_xtj || undefined;
          if (parsingXtj !== undefined) {
            this.parseList[4].data = parsingXtj;
          } else {
            this.parseList[4].data = '[]';
          }
          this.parseList[4].edit = [];
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

  /**
   * 退出登录
   */
  loginout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * 修改密码
   */
  editPassWord(): void {
    const modal = this.modal.create({
      nzTitle: '修改密码',
      nzContent: EditpasswordComponent,
      nzWrapClassName: 'edituser-dialog-wrap',
      nzComponentParams: {
        oldPassword: '',
        newPassword: ''
      },
      nzFooter: null
    });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));
  }
}
