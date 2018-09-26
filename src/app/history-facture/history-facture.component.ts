import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../history/history.service';
import { HistoryFactureService } from './history-facture.service';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '../../../node_modules/@angular/forms';
import { MenuItem } from '../../../node_modules/primeng/api';
declare var $: any;
import swal from 'sweetalert2';
import { HistoryComponent } from '../history/history.component';
@Component({
  selector: 'app-history-facture',
  templateUrl: './history-facture.component.html',
  styleUrls: ['./history-facture.component.css']
})
export class HistoryFactureComponent implements OnInit {
  private facture;
  private factureDetails;
  private showDetailsCode;
  modalReference: any;
  private static selectedFactureRowData;
  private static selectedFactureID;
  private static selectedFactureType;
  private static selectedFactureDetailsRowData;
  private static selectedFactureDetailsID;
  rightClick: MenuItem[];
  private globalHistoryFactureDT;
  private globalHistoryFactureDetailsDT;
  private itemsForm;
  // historyComponent: any;

  constructor(private HistoryComponent:HistoryComponent,
    private historyService: HistoryService,private historyFactureService: HistoryFactureService,
    private modalService: NgbModal, 
    private fb: FormBuilder) { }

  ngOnInit() {
    this.getHistoryFactureDT();

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
        label: 'Supprimé',
        icon: 'pi pi-fw pi-del',
        command: (event) => {
          let element: HTMLElement = document.getElementById('deletedBtn') as HTMLElement;
          element.click();
        }
      }
    ];
    
  }
  getHistoryFactureDT(){
    if(this.globalHistoryFactureDT==null){
      var historyFactureDT = $('#historyFactureDT').DataTable({
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
        lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
        ajax: {
          type: "get",
          // url: "http://localhost/MoussaNet/src/assets/api/dataTables/stockDataTable.php",
          // data:{"type":"OF"},
          cache: false,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          { data: "clientName", title: "CLIENTS" },
          { data: "date", title: "DATE" },
          { data: "code", title: "CODE"}
          // { data: "num_of_credit", title: "NB. OF CREDITS $","searchable": false,"sortable": false },
          // { data: "price", title: "PRICE","searchable": false,"sortable": false , render: $.fn.dataTable.render.number(',', '.', 0, 'LL ') }
        ]
      });
      this.globalHistoryFactureDT = historyFactureDT;
      historyFactureDT.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
          HistoryFactureComponent.selectedFactureRowData = historyFactureDT.row(indexes).data();
          var ID = historyFactureDT.row(indexes).data()['ID'];
          var type = historyFactureDT.row(indexes).data()['type'];
          HistoryFactureComponent.selectedFactureID = ID;
          HistoryFactureComponent.selectedFactureType = type;
        }
        else if (type === 'column') {
          HistoryFactureComponent.selectedFactureID = -1;
          HistoryFactureComponent.selectedFactureType = -1;
        }
      });
      $('#historyFactureDT tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          historyFactureDT.row(this).select();
        }
      });
      $('#historyFactureDT').on('key-focus.dt', function (e, datatable, cell) {
        $(historyFactureDT.row(cell.index().row).node()).addClass('selected');
      });
      $('#historyFactureDT').on('key-blur.dt', function (e, datatable, cell) {
        $(historyFactureDT.row(cell.index().row).node()).removeClass('selected');
      });
    } else{
      this.globalHistoryFactureDT.ajax.reload(null, false);
    }
  }
  openShowDetails(showDetails) {
    this.HistoryComponent.showFactureDetails(1,showDetails);
    // this.historyFactureService.getFactureDetails(HistoryFactureComponent.selectedFactureID).subscribe(Response => {
      // this.factureDetails = Response;
    //   var detailFactureDT = $('#detailFactureDT').DataTable({
    //     responsive: true,
    //     paging: true,
    //     pagingType: "full_numbers",
    //     serverSide: false,
    //     processing: true,
    //     select: {
    //       "style": "single"
    //     },
    //     ordering: true,
    //     stateSave: false,
    //     fixedHeader: false,
    //     searching: true,
    //     lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
    //     data: this.factureDetails,
    //     order: [[0, 'desc']],
    //     columns: [

    //       { data: "itemsName", title: "ARTICLE" },
    //       { data: "crt", title: "CRT" ,"searchable": false,"sortable": false},
    //       { data: "piece", title: "PIECE","searchable": false,"sortable": false },
    //       // { data: "piece", title: "PIECE","searchable": false,"sortable": false },
    //       { data: "note", title: "NOTE" ,"searchable": false,"sortable": false},

    //     ],
    //     "columnDefs": [
    //       {
    //         "targets": 2,
    //         "data": "type",
    //         "render": function (data, type, row, meta) {
    //           if (data == null) {
    //             return 'Payment';
    //           }
    //           else if (data == 'a') {
    //             return 'Add';
    //           }
    //           else if(data == 'w') {
    //             return 'Withdraw';
    //           }
    //         }
    //       }
    //     ]
    //   });
    //   $('#detailFactureDT tbody').on('mousedown', 'tr', function (event) {
    //     if (event.which == 3) {
    //       detailFactureDT.row(this).select();
    //     }
    //   });

    //   $('#detailFactureDT').on('key-focus.dt', function (e, datatable, cell) {
    //     $(detailFactureDT.row(cell.index().row).node()).addClass('selected');

    //   });
    //   $('#detailFactureDT').on('key-blur.dt', function (e, datatable, cell) {
    //     $(detailFactureDT.row(cell.index().row).node()).removeClass('selected');
    //   });

    // // }, error => {
    // //   alert(error)
    // // });
    // this.modalReference = this.modalService.open(showDetails, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
    // // this.showDetailsCode="Show Details " + AccessoriesDrawerComponent.selectedDay;
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
}
