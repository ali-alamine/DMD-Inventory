import { Component, OnInit } from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { HistoryService } from '../history/history.service';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '../../../node_modules/@angular/forms';
import { Router } from '../../../node_modules/@angular/router';
import { MenuItem } from '../../../node_modules/primeng/api';
declare var $: any;
import swal from 'sweetalert2';

@Component({
  selector: 'app-history-return',
  templateUrl: './history-return.component.html',
  styleUrls: ['./history-return.component.css']
})
export class HistoryReturnComponent implements OnInit {
  private facture;
  private factureDetails;
  private showDetailsCode;
  modalReference: any;
  private selectedFactureRowData;
  static selectedFactureID;
  rightClick2: MenuItem[];
  private globalHistoryReturnDT;
  private globalReturnDetailsDT;
  private itemsForm;
  static selectedFacture = new Array();
  lengthFR;
  dataComfirm={};

  constructor(private historyComponent : HistoryComponent,
    private historyService: HistoryService,
    private modalService : NgbModal, 
    private fb : FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.getHistoryReturnDT();
    this.rightClick2 = [
      // {
      //   label: 'Afficher',
      //   icon: 'pi pi-fw pi-bars',
      //   command: (event) => {
      //     let element: HTMLElement = document.getElementById('showDetailsBtn') as HTMLElement;
      //     element.click();
      //   }
      // },
      {
        label: 'Modifier',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editBtn') as HTMLElement;
          element.click();
        }
      },
      // {
      //   label: 'Touts Comfirm',
      //   icon: 'pi pi-fw pi-times',
      //   command: (event) => {
      //     let element: HTMLElement = document.getElementById('deletedBtn') as HTMLElement;
      //     element.click();
      //   }
      // },
      // {
      //   label: 'Touts Rejeter',
      //   icon: 'pi pi-fw pi-times',
      //   command: (event) => {
      //     let element: HTMLElement = document.getElementById('deletedBtn') as HTMLElement;
      //     element.click();
      //   }
      // }
    ];
    
  }
  getHistoryReturnDT(){
    if(this.globalHistoryReturnDT==null){
      var historyReturnDT = $('#historyReturnDT').DataTable({
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
          data:{"show":"return"},
          cache: false,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          { data: "per_name", title: "CLIENTS" },
          { data: "inv_date_req", title: "DATE" },
          { data: "inv_code", title: "CODE"}
        ],
        "columnDefs": [ {
          "targets": 2,
          "createdCell": function (td, data, rowData, row, col) {
            if ( rowData['inv_type'] == "FR") {
              $(td).html(" <span style='color: #FF0000;' >"+data+"</span> ");
            } 
          }
        } ]
      });
      this.globalHistoryReturnDT = historyReturnDT;
      historyReturnDT.on('select', function (e, dt, type, indexes) {
        HistoryReturnComponent.selectedFacture = [];
        if (type === 'row') {
          this.selectedFactureRowData = historyReturnDT.row(indexes).data();
          HistoryReturnComponent.selectedFactureID = historyReturnDT.row(indexes).data()['invID'];

        }
      });
      $('#historyFactureDT tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          historyReturnDT.row(this).select();
        }
      });
      $('#historyReturnDT').on('key-focus.dt', function (e, datatable, cell) {
        $(historyReturnDT.row(cell.index().row).node()).addClass('selected');
      });
      $('#historyReturnDT').on('key-blur.dt', function (e, datatable, cell) {
        $(historyReturnDT.row(cell.index().row).node()).removeClass('selected');
      });
    
    } else{
      this.globalHistoryReturnDT.ajax.reload(null, false);
    }
  }
  openShowDetails() {
    this.historyComponent.showFactureDetails(HistoryReturnComponent.selectedFacture);
  }
  editFacture(showDetails){
    this.historyService.getFactureReturnDetails(HistoryReturnComponent.selectedFactureID).subscribe(Response => {
      this.factureDetails = Response;
    //   var factureDetailDT = $('#detailFactureDT').DataTable({
    //     responsive: true,
    //     paging: false,
    //     lengthChange:false,
    //     serverSide: false,
    //     processing: true,
    //     ordering: true,
    //     stateSave: false,
    //     fixedHeader: false,
    //     searching: true,
    //     data: this.factureDetails,
    //     order: [[0, 'desc']],
    //     columns: [
    //       { data: "item_name", title: "ARTICLE" },
    //       { data: "ord_crt", title: "CRT" ,"searchable": false,"sortable": false},
    //       { data: "ord_piece", title: "PIECE","searchable": false,"sortable": false },
    //       { data: "ordID", title: "ACTION" ,"searchable": false,"sortable": false,
    //       "render": function (data,meta,row) {
    //       return '<button  (click)="confirmOrder('+data+')" style="color:blue">Confirmer</button>     '+
    //       '<button  (click)="rejectOrder('+data+')" style="color:red">Rejeter</button>';}},
    //     ],"columnDefs": [ {
    //       "targets": 0,
    //       "render": function (td, data, rowData, row, col) {
    //         if (rowData['ord_item_isDamaged'] == 1) {    
    //               return  rowData['item_name'] + " | GATE" ;
    //         } else{
    //           return rowData['item_name'];
    //         }
    //     } 
    //     }]
    //   });
    //   this.globalReturnDetailsDT = factureDetailDT;
    //   $('#factureDetailDT tbody').on('mousedown', 'tr', function (event) {
    //     if (event.which == 3) {
    //       factureDetailDT.row(this).select();
    //     }
    //   });

    //   $('#factureDetailDT').on('key-focus.dt', function (e, datatable, cell) {
    //     $(factureDetailDT.row(cell.index().row).node()).addClass('selected');

    //   });
    //   $('#factureDetailDT').on('key-blur.dt', function (e, datatable, cell) {
    //     $(factureDetailDT.row(cell.index().row).node()).removeClass('selected');
    //   });
    }, error => {
      alert(error)
    });
    this.modalReference = this.modalService.open(showDetails, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
  }
  deleteFacture(){
    swal({
      title: "Supprimer Facture",
      html: "Vous voulez vraiment supprimer cette Facture!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.historyService.deleteFacture(HistoryReturnComponent.selectedFactureID,HistoryReturnComponent.selectedFacture[0].type).subscribe(Response => {
          // console.log(Response)
          if(Response!=0){
            this.globalHistoryReturnDT.ajax.reload(null, false);
            swal({
              type: 'success',
              title: 'Succès',
              text: "Facture est supprimer..",
              showConfirmButton: false,
              timer: 1000
            });
          }
          else if(Response==0){
            swal({
              type: 'error',
              title: 'Attention',
              text: "Il faut supprimer tous les articles avant de supprimer la facture.",
              showConfirmButton: false,
              timer: 4000
            });
          }
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
  confirmOrder(ordID,invID,crt,piece,itemID,isDamaged,packingList){
      // console.log(ordID)
      this.dataComfirm['ordID']= ordID;
      this.dataComfirm['invID']=invID;
      this.dataComfirm['crt']=crt;
      this.dataComfirm['piece']=piece;
      this.dataComfirm['itemID']=itemID;
      this.dataComfirm['isDamaged']=isDamaged;
      this.dataComfirm['packingList']=packingList;
    console.log(ordID)
    this.historyService.confirmOrder(this.dataComfirm).subscribe(Response => {
      if(Response == 0) {
        // this.modalReference = this.modalService.open(showDetails, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      // this.globalReturnDetailsDT.ajax.reload(null, false);
      // $('.showTemplate').

      }
      this.editFacture('showDetails');
      // this.globalReturnDetailsDT.ajaeditFacture(showDetails)x.reload(null, false);
      swal({
        type: 'success',
        title: 'Success',
        text: 'Order Confirmer.',
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
  rejectOrder(ordID){
    this.historyService.rejectOrder(ordID).subscribe(Response => {
      this.editFacture('showDetails');
      // this.globalReturnDetailsDT.ajax.reload(null, false);
      swal({
        type: 'success',
        title: 'Success',
        text: 'Order Rejeter.',
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
}
