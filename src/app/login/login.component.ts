import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from './login.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  modalReference: any;
  hide = true;
  textError;
  private sub;
  userForm;
  modalName = "connModal"

  constructor(private modalService: NgbModal, 
    private fb: FormBuilder,
    private loginService:LoginService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.data.subscribe(params => {
      if(params['logout']!== false)
        localStorage.setItem("user", '0');
    // localStorage.clear();
    });
    if (localStorage.getItem("user") !== '1') {
      this.userForm = this.fb.group({
        userName: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  setUser() {
    this.loginService.getConnection(this.userForm.value).subscribe(response=>{
      var res = response;
      if(res == 1){
        localStorage.setItem("user", '1');
        this.router.navigate(["facture/client"]);
      } else{
        this.textError="Veuillez réessayer une autre fois";
        this.userForm.reset();
        document.getElementById('userName').focus();
      }

    })
  }
}
