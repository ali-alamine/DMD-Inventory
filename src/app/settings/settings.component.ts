import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  modalReference: any;
  uploadedFile: any[] = [];
  constructor(private modalService: NgbModal, private settingsService: SettingsService) { }

  ngOnInit() {
  }

  openRestoreModal(restoreModal) {
    this.modalReference = this.modalService.open(restoreModal, { centered: true, size: 'lg', ariaLabelledBy: 'modal-basic-title' });
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
