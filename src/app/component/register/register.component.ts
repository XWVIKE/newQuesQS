import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm!: FormGroup;
  loading = false;
  errorMsg;

  registerForm(): void {
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
      userName: this.validateForm.value.userName,
      mobile: this.validateForm.value.mobile,
      password: this.validateForm.value.password
    };
    // console.log(data);
    this.appService.register(data).subscribe(t => {
      // console.log(t);
      this.loading = false;
      if (t.data !== null) {
        this.errorMsg = null;
        localStorage.setItem('token', t.data);
        localStorage.setItem('mobile', data.mobile);
        localStorage.setItem('name', data.userName);
        this.router.navigate(['/ques']);
      } else {
        this.errorMsg = t.message;
      }
    });
  }


  constructor(private fb: FormBuilder, private appService: AppService, private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

}
