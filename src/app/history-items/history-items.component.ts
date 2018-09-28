import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../history/history.service';
import { HistoryItemsService } from './history-items.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/api';
declare var $: any;
import swal from 'sweetalert2';
import { HistoryComponent } from '../history/history.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-history-items',
  templateUrl: './history-items.component.html',
  styleUrls: ['./history-items.component.css']
})
export class HistoryItemsComponent implements OnInit {
  private items;
  private fatctureDetails;
  modalReference: any;
  private static selectedItemsRowData;
  static selectedFactureID;
  static selectedItemID;
  rightClick: MenuItem[];
  private globalHistoryItemsDT;
  private globalHistoryItemsDetailsDT;
  private itemsForm;
  static selectedFacture = new Array();

  constructor(private historyComponent : HistoryComponent,
    private histoeyService: HistoryService,
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.getHistoryItemsDT();

    this.rightClick = [
      {
        label: 'Afficher',
        icon: 'pi pi-fw pi-bars',
        command: (event) => {
          let element: HTMLElement = document.getElementById('showDetailsBtn') as HTMLElement;
          element.click();
        }
      },
      {
        label: 'Modifier',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editBtn') as HTMLElement;
          element.click();
        }
      },
      {
        label: 'Supprimé',
        icon: 'pi pi-fw pi-times',
        command: (event) => {
          let element: HTMLElement = document.getElementById('deletedBtn') as HTMLElement;
          element.click();
        }
      }
    ];
  }
  getHistoryItemsDT(){
    if(this.globalHistoryItemsDT==null){
      var historyItemsDT = $('#historyItemsDT').DataTable({
        buttons: ["print"],
        responsive: false,
        paging: true,
        pagingType: "full_numbers",
        serverSide: true,
        processing: true,
        ordering: true,
        stateSave: true,      
        autoWidth: true,
        select: {
          "style": "single"
        },
        searching: true,
        lengthMenu: [[50, 100, 150, 200, 300], [50, 100, 150, 200, 300]],
        ajax: {
          type: "get",
          url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/historyDT.php",
          data:{"show":"items"},
          cache: false,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          { data: "inv_code", title: "CODE" },
          { data: "inv_type", title: "TYPE" },
          { data: "item_name", title: "Article" },
          { data: "ord_crt", title: "CRT" },
          { data: "ord_piece", title: "PIECE" },
          { data: "inv_date_req", title: "DATE" },
          { data: "per_name", title: "CLIENT" }

        ],
        "columnDefs": [ {
          "targets": 0,
          "createdCell": function (td, data, rowData) {
            if ( rowData['inv_type'] == "FC") {           
              $(td).html(" <span style='color: 	#008000;' >"+data+"</span> ");
            }
            if ( rowData['inv_type'] == "FR") {           
              $(td).html(" <span style='color: #FF0000;' >"+data+"</span> ");
            }
            if ( rowData['inv_type'] == "FD") {          
              $(td).html(" <span style='color: #0000FF;' >"+data+"</span> ");
            } 
          }
        },
        {
          "targets": 1,
          "createdCell": function (td, data) {
            if ( data == "FC") {           
              $(td).html(" <span style='color: 	#008000;' >"+data+"</span> ");
            }
            if ( data == "FR") {           
              $(td).html(" <span style='color: #FF0000;' >"+data+"</span> ");
            }
            if ( data == "FD") {          
              $(td).html(" <span style='color: #0000FF;' >"+data+"</span> ");
            } 
          }
        }]
      });
      var selectedRowLS = localStorage.getItem('selectedRow');
      var x = localStorage.getItem('XOffset');
      var y = localStorage.getItem('YOffset');
      if (selectedRowLS !== null){
        historyItemsDT.row(selectedRowLS).select();
        localStorage.removeItem('selectedRow');
      }
  
      if (x !== null && y !== null){
        window.scroll(+x,+y);
        localStorage.removeItem('XOffset');
        localStorage.removeItem('YOffset');
      }
      this.globalHistoryItemsDT = historyItemsDT;
      historyItemsDT.on('select', function (e, dt, type, indexes) {
        HistoryItemsComponent.selectedFacture = [];
        if (type === 'row') {
          localStorage.setItem('selectedRow', indexes);
          HistoryItemsComponent.selectedItemsRowData = historyItemsDT.row(indexes).data();
          HistoryItemsComponent.selectedFactureID = historyItemsDT.row(indexes).data()['invID'];
          HistoryItemsComponent.selectedItemID = historyItemsDT.row(indexes).data()['ordID'];
          HistoryItemsComponent.selectedFacture.push({
            ID:historyItemsDT.row(indexes).data()['invID'],
            type:historyItemsDT.row(indexes).data()['inv_type'],
            clientName:historyItemsDT.row(indexes).data()['per_name'],
            phone:historyItemsDT.row(indexes).data()['per_phone'],
            address:historyItemsDT.row(indexes).data()['per_address'],
            date_req:historyItemsDT.row(indexes).data()['inv_date_req'],
            date_del:historyItemsDT.row(indexes).data()['inv_date_del'],
            code:historyItemsDT.row(indexes).data()['inv_code']
          });
        }
        else if (type === 'column') {
          HistoryItemsComponent.selectedFactureID =-1;
          HistoryItemsComponent.selectedItemID = -1;
        }
      });
      $('#historyItemsDT tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          historyItemsDT.row(this).select();
        }
      });
      $('#historyItemsDT').on('key-focus.dt', function (e, datatable, cell) {
        $(historyItemsDT.row(cell.index().row).node()).addClass('selected');
      });
      $('#historyItemsDT').on('key-blur.dt', function (e, datatable, cell) {
        $(historyItemsDT.row(cell.index().row).node()).removeClass('selected');
      });
    } else{
      this.globalHistoryItemsDT.ajax.reload(null, false);
    }
  }
  openShowDetails() {
    this.historyComponent.showFactureDetails(HistoryItemsComponent.selectedFacture);
  }
  editFacture(){
    localStorage.setItem('XOffset', window.pageXOffset.toString());
    localStorage.setItem('YOffset', window.pageYOffset.toString());
    localStorage.setItem('routerHistory',"history/items");
    if(HistoryItemsComponent.selectedFacture[0].type=="FR")
      this.router.navigate(["sell/return"], { queryParams: { factureID: HistoryItemsComponent.selectedFactureID }});
    if(HistoryItemsComponent.selectedFacture[0].type=="FD")
      this.router.navigate(["sell/supply"], { queryParams: { factureID: HistoryItemsComponent.selectedFactureID }});
    if(HistoryItemsComponent.selectedFacture[0].type=="FC")
      this.router.navigate(["sell/facture"], { queryParams: { factureID: HistoryItemsComponent.selectedFactureID }});
  }
  deleteItem(){
    var title = "Supprimer Article";
    var text = "Vous voulez vraiment supprimer cette Article!"
    // if (SubscribersComponent.selectedRowData['is_activated'] == 1) {
    //   text = "Do you want to <b> deactivate </b> this user ?";
    //   title = "Deactivate User";
    // }

    swal({
      title: title,
      html: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.histoeyService.deleteItem(HistoryItemsComponent.selectedItemID).subscribe(Response => {
          this.globalHistoryItemsDT.ajax.reload(null, false);
          swal({
            type: 'success',
            title: 'Succès',
            text: "L' article est bien supprimer du facture.",
            showConfirmButton: false,
            timer: 1000
          });
        }, error => {
          swal({
            type: 'error',
            title: error.statusText,
            text: error.message
          });
        });
      }
    });
  }
  }
  // openOperationModal(openModal,type){
  //   this.modalReference = this.modalService.open(openModal, { centered: true, ariaLabelledBy: 'modal-basic-title' });
  //   if(type=='a')
  //     this.operationModalTitle = 'ADD'; 
  //   else if(type=='w')
  //     this.operationModalTitle = 'WITHDRAW';
  //   this.operationForm = this.fb.group({
  //     op_type: [type],
  //     drawer: ['a'],
  //     amount: [ 0,Validators.min(1)],
  //     comment: ['']
  //   });

  // }
  // addNewOperation(){
  //   this.drawerService.newOperation(this.operationForm.value).subscribe(Response => {
  //     this.accDrawer='';
  //     $('#accDrawerDT').DataTable().destroy();
  //     $('#accDrawerDT').empty();
  //     this.getAccDrawerDT();
  //     swal({
  //       type: 'success',
  //       title: 'Success',
  //       text:'Operation Successfully',
  //       showConfirmButton: false,
  //       timer: 1000
  //     });
  //   }, error => {
  //     swal({
  //       type: 'error',
  //       title: error.statusText,
  //       text:error.message
  //     });
  //   });
  //   this.modalReference.close();
  // }
  // openShowDetails(showDetails) {
  //   this.accDrawerService.getAccDetailsDay(AccessoriesDrawerComponent.selectedDay).subscribe(Response => {
  //     this.detailsDay = Response;
  //     var detailDayDT = $('#detailDay').DataTable({
  //       responsive: true,
  //       paging: true,
  //       pagingType: "full_numbers",
  //       serverSide: false,
  //       processing: true,
  //       select: {
  //         "style": "single"
  //       },
  //       ordering: true,
  //       stateSave: false,
  //       fixedHeader: false,
  //       searching: true,
  //       lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
  //       data: this.detailsDay,
  //       order: [[0, 'desc']],
  //       columns: [

  //         { data: "dayTime", title: "Time" },
  //         { data: "amount", title: "Amount", render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') },
  //         { data: "type", title: "Type" },
  //         { data: "note", title: "Note" }

  //       ],
  //       "columnDefs": [
  //         {
  //           "targets": 2,
  //           "data": "type",
  //           "render": function (data, type, row, meta) {
  //             if (data == null) {
  //               return 'Payment';
  //             }
  //             else if (data == 'a') {
  //               return 'Add';
  //             }
  //             else if(data == 'w') {
  //               return 'Withdraw';
  //             }
  //           }
  //         }
  //       ]
  //     });
  //     $('#detailDay tbody').on('mousedown', 'tr', function (event) {
  //       if (event.which == 3) {
  //         detailDayDT.row(this).select();
  //       }
  //     });

  //     $('#detailDay').on('key-focus.dt', function (e, datatable, cell) {
  //       $(detailDayDT.row(cell.index().row).node()).addClass('selected');

  //     });
  //     $('#detailDay').on('key-blur.dt', function (e, datatable, cell) {
  //       $(detailDayDT.row(cell.index().row).node()).removeClass('selected');
  //     });

  //   }, error => {
  //     alert(error)
  //   });
  //   this.modalReference = this.modalService.open(showDetails, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
  //   this.showDetailsDay="Show Details " + AccessoriesDrawerComponent.selectedDay;
  // }

