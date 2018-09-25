import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Moussa Net';
  modalReference: any;
  objDate;
  drawerForm;
  constructor(private modalService: NgbModal, private fb: FormBuilder) { }
  ngOnInit() {
    var date = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    if (localStorage.getItem("date") !== date) {
      this.drawerForm = this.fb.group({
        internetAmount: ['', Validators.required],
        mobileDrawer: ['', Validators.required],
        accessories: ['', Validators.required]
      });
      let element: HTMLElement = document.getElementById('editSupplierBtn') as HTMLElement;
      element.click();   
    }
  }


  openSupplierModal(supplierModal) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    };
    this.modalReference = this.modalService.open(supplierModal, ngbModalOptions);

  }

  setDrawer() {
    
    
    var date = formatDate(new Date(), 'yyyy/MM/dd', 'en')    
    localStorage.setItem("date", date);
    this.modalReference.close();
    console.log(this.drawerForm.value)
  }

}
