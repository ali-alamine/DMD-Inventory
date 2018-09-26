import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../history/history.service';
import { HistoryItemsService } from './history-items.service';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '../../../node_modules/@angular/forms';
import { MenuItem } from '../../../node_modules/primeng/api';
declare var $: any;
import swal from 'sweetalert2';
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
  private static selectedItemsID;
  private static selectedItemsDetailsRowData;
  private static selectedItemsDetailsID;
  rightClick: MenuItem[];
  rightClick2: MenuItem[];
  private globalHistoryItemsDT;
  private globalHistoryItemsDetailsDT;
  private itemsForm;
  constructor(private histoeyService: HistoryService,private historyItemsService: HistoryItemsService,
    private modalService: NgbModal, 
    private fb: FormBuilder) { }

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
        label: 'Supprimé',
        icon: 'pi pi-fw pi-del',
        command: (event) => {
          let element: HTMLElement = document.getElementById('deletedBtn') as HTMLElement;
          element.click();
        }
      }
    ];
    this.rightClick2 = [
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
        icon: 'pi pi-fw pi-del',
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
          { data: "code", title: "CODE" },
          { data: "type", title: "TYPE" },
          { data: "itemName", title: "Article" },
          { data: "crt", title: "CRT" },
          { data: "piece", title: "PIECE" },
          { data: "date", title: "DATE" },
          { data: "clientName", title: "CLIENT" }

        ]
        // ,"columnDefs": [ {
        //   "targets": 1,
        //   "createdCell": function (td, cellData, rowData, row, col) {
            
        //     if ( rowData['isDamagedFlag']) {              
        //       $(td).html(cellData+" <i style='float:right; color: #FF0000;' md-18 class='material-icons'>new_releases</i> ")
        //     }
        //   }
        // } ],
        // createdRow: function (row, data, index) {
        //   if (data['isDamagedFlag'] == 1) {            
        //     // $(row).addClass("table-warning");
        //     $(row).attr('title', " CRT: " + data['crtD'] + " || Piece: " + data['pieceD'] + " || Price: " + data['priceD']);
             

        //   }
        // }
      });
      this.globalHistoryItemsDT = historyItemsDT;
      historyItemsDT.on('select', function (e, dt, type, indexes) {
        if (type === 'row') {
          HistoryItemsComponent.selectedItemsRowData = historyItemsDT.row(indexes).data();
          var data = historyItemsDT.row(indexes).data()['ID'];
          HistoryItemsComponent.selectedItemsID = data;
        }
        else if (type === 'column') {
          HistoryItemsComponent.selectedItemsID = -1;
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

}
