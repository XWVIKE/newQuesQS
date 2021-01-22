import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  loading = false;
  errorMsg;

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (!this.validateForm.valid) {
      this.errorMsg = null;
      return;
    }
    this.loading = true;
    const data = {
      mobile: this.validateForm.value.userName,
      password: this.validateForm.value.password
    };
    // console.log(data)
    this.appService.login(data).subscribe(t => {
      // console.log(t);
      this.loading = false;
      if (t.data === null) {
        this.errorMsg = t.message;
      } else {
        this.errorMsg = null;
        localStorage.setItem('token', t.data);
        this.getUserInfo();
        this.router.navigate(['/ques']);
      }
      // this.message.success('修改成功');
    });
  }
  getUserInfo() {
    const data={}
    this.appService.getUserInfo(data).subscribe(t => {
      // console.log(t);
      localStorage.setItem('mobile', t.Mobile);
      localStorage.setItem('name', t.UserName);
    })
  }

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });

  }

}
