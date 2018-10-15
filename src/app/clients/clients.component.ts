import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClientsService } from './clients.service';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { Router } from '../../../node_modules/@angular/router';
declare var $: any;
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  modalReference: any;
  private clientForm;
  clientModalTitle;
  editFlag = false;
  private static selectedRowData;
  private static selectedClientID;
  editedClientData = {};
  items: MenuItem[];
  private globalClientsDT;
  isExist;

  constructor(private modalService: NgbModal, 
    private fb: FormBuilder, 
    private clientsService: ClientsService,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    var subscriberDataTable = $('#clientsDT').DataTable({
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: {
        "style": "single"
      },
      searching: true,
      lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/clientsDataTable.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "name", title: "Name" },
        { data: "phone", title: "Phone" },
        { data: "address", title: "Address" },
        { data: "code", title: "Code", render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }

      ]
    });

    this.items = [
      {
        label: 'Modifier',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editClientBtn') as HTMLElement;
          element.click();
        }

      }
    ];
    this.globalClientsDT = subscriberDataTable;

    subscriberDataTable.on('select', function (e, dt, type, indexes) {
      if (type === 'row') {
        ClientsComponent.selectedRowData = subscriberDataTable.row(indexes).data();
        var data = subscriberDataTable.row(indexes).data()['ID'];
        ClientsComponent.selectedClientID = data;
      }
      else if (type === 'column') {
        ClientsComponent.selectedClientID = -1;
      }
    });

    $('#clientsDT tbody').on('mousedown', 'tr', function (event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $('#clientsDT').on('key-focus.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass('selected');

    });
    $('#clientsDT').on('key-blur.dt', function (e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass('selected');
    });
    
  }

  openClientModal(clientModal) {
    this.modalReference = this.modalService.open(clientModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
    var name = '';
    var phone = '';
    var address = '';
    this.clientModalTitle = "Ajouter Client";

    if (this.editFlag == true) {
      this.clientModalTitle = "Modifier Client";
      name = ClientsComponent.selectedRowData['name'];
      phone = ClientsComponent.selectedRowData['phone'];
      address = ClientsComponent.selectedRowData['address'];
    }
      this.clientForm = this.fb.group({
        name: [name, [Validators.required,Validators.minLength(3)]],
        phone: [phone, Validators.required],
        address: [address, Validators.required]
      });
      this.onClientIsExistChange();
      this.isExist==false;
  }
  onClientIsExistChange(): void {
    this.clientForm.get('name').valueChanges.subscribe(val => {
      var data = this.clientForm.get('name').value;
      this.clientsService.searchClientName(data).subscribe(Response => {
        if(Response == 1){
          // alert('exist')
          this.isExist = true;
        }
        else
          this.isExist = false;
      })
    })
  }
  addEditClient() {
    if (this.editFlag == true) {
      this.editedClientData['name'] = this.name.value;
      this.editedClientData['address'] = this.address.value;
      this.editedClientData['phone'] = this.phoneNumber.value;
      this.editedClientData['ID'] = ClientsComponent.selectedClientID;
      this.clientsService.editClient(this.editedClientData).subscribe(Response => {
        this.globalClientsDT.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Succès',
          text: 'Client mis à jour avec succès',
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
    }
    else {
      this.clientsService.addNewClient(this.clientForm.value).subscribe(Response => {
        this.globalClientsDT.ajax.reload(null, false);
        Swal({
          type: 'success',
          title: 'Succès',
          text: 'Client ajouté avec succès',
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
    }

    this.modalReference.close();
  }


  get name() {
    return this.clientForm.get('name');
  }
  get phoneNumber() {
    return this.clientForm.get('phone');
  }
  get address() {
    return this.clientForm.get('address');
  }

}
