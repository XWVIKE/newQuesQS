import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AppService } from '../../../app.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dialog',
  templateUrl: './editpassword.dialog.html',
  styles: [`
  ::ng-deep .edituser-dialog-wrap .ant-modal-body{
    padding: 16px 0 0;
  }
  ::ng-deep .edituser-dialog .edituser-dialog-footer {
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px 10px 10px;
    text-align: right;
    border-radius: 0 0 4px 4px;
  }
  `]
})
export class EditpasswordComponent implements OnInit {
  validateForm!: FormGroup;
  // 原密码
  @Input()
  oldPassword: string;
  // 新密码
  @Input()
  newPassword: string;

  // 用户信息
  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private subject: NzModalRef,
    private appService: AppService,
    private router: Router, private message: NzMessageService,
  ) { }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      newPasswords: [null, [Validators.required]],
    });
  }
  handleOk(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      return;
    }
    if (this.validateForm.controls.newPassword.value !== this.validateForm.controls.newPasswords.value) {
      this.message.error('新密码与确认密码不一致');
      return;
    }
    const data = {
      oldPassword: this.validateForm.controls.oldPassword.value,
      newPassword: this.validateForm.controls.newPassword.value
    };
    this.appService.editPassword(data).subscribe(res => {
      // console.log(res);
      if (res.message === '成功') {
        this.message.success('修改成功，请重新登录');
        this.subject.destroy('onCancel');
        this.router.navigate(['/login']);
      } else {
        this.message.error(res.message);
      }
    });
  }
  handleCancel(): void {
    this.subject.destroy('onCancel');
  }
}
