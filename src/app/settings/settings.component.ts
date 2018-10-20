import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from './settings.service';
import { Router } from '../../../node_modules/@angular/router';
import { FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  modalReference: any;
  uploadedFile: any[] = [];
  private userForm;
  userInfo;
  constructor(
    private router: Router,
    private modalService: NgbModal, 
    private settingsService: SettingsService , 
    private fb: FormBuilder) { }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
  }

  openRestoreModal(restoreModal) {
    this.modalReference = this.modalService.open(restoreModal, { centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title' });
  }
  openEditUserModal(editUserModal) {
    var id='';
    var name = '';
    var pass ="";
    this.settingsService.getUser().subscribe(Response => {
      this.userInfo = Response;
      id=this.userInfo[0].userID;
      name=this.userInfo[0].user_name;
      pass=this.userInfo[0].user_password;
      this.userForm = this.fb.group({
        userID: [id],
        userName: [name, [Validators.required]],
        password: [pass, [Validators.required]]
      });
      console.log(this.userForm.value)
      this.modalReference = this.modalService.open(editUserModal, { centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title' });
      
    }, error => {
      console.log(error);
    });
    
  }
  editUser(){
    this.settingsService.editUser(this.userForm.value).subscribe(Response => {
      Swal({
        type: 'success',
        title: 'Succès',
        text: "Modifier l'utilisateur",
        showConfirmButton: false,
        timer: 1000
      });
    }, error => {
      Swal({
        type: 'error',
        title: error.statusText,
        text: error.message
      });
    });
    this.modalReference.close();
  }
  myUpload(event) {
    for (let file of event.files) {
      this.uploadedFile.push(file);

      this.settingsService.uploadScript(file).subscribe(Response => {
        console.log(Response);
      }, error => {
        console.log(error);
      });
    }
  }


  backup() {

    this.settingsService.backup();
  }

}
