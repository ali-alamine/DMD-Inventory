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
      {
        label: 'Con/Rej',
        icon: 'pi pi-fw pi-pencil',
        command: (event) => {
          let element: HTMLElement = document.getElementById('editBtn') as HTMLElement;
          element.click();
        }
      },
      {
        label: 'Tous Confirmer',
        icon: 'pi pi-fw pi-arrow-right',
        command: (event) => {
          let element: HTMLElement = document.getElementById('confirmBtn') as HTMLElement;
          element.click();
        }
      },
      {
        label: 'Tout Rejeter',
        icon: 'pi pi-fw pi-times',
        command: (event) => {
          let element: HTMLElement = document.getElementById('rejectBtn') as HTMLElement;
          element.click();
        }
      }
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
  getFactureDetail(showDetails){
    if(showDetails!="")
      this.modalReference = this.modalService.open(showDetails, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
    this.historyService.getFactureReturnDetails(HistoryReturnComponent.selectedFactureID).subscribe(Response => {
      this.factureDetails = Response;
    }, error => {
      alert(error)
    });
  }
  confirmOrder(ordID,invID,crt,piece,itemID,isDamaged,packingList){
    this.dataComfirm['ordID']= ordID;
    this.dataComfirm['invID']=invID;
    this.dataComfirm['crt']=crt;
    this.dataComfirm['piece']=piece;
    this.dataComfirm['itemID']=itemID;
    this.dataComfirm['isDamaged']=isDamaged;
    this.dataComfirm['packingList']=packingList;
    this.historyService.confirmOrder(this.dataComfirm).subscribe(Response => {
      this.getFactureDetail('');
      if(Response == 0) {
        this.globalHistoryReturnDT.ajax.reload(null, false);
        this.modalReference.close();
      }
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
  rejectOrder(ordID,invID){
    this.historyService.rejectOrder(ordID,invID).subscribe(Response => {
      this.getFactureDetail('');
      if(Response == 0) {
        this.globalHistoryReturnDT.ajax.reload(null, false);
        this.modalReference.close();
      }
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
  confirmAll(){
    var title = "Confirmer Article";
    var text = "Vous voulez vraiment Confirmer toutes les Articles de cette Facture!"
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
      this.historyService.confirmAll(HistoryReturnComponent.selectedFactureID).subscribe(Response => {
        this.globalHistoryReturnDT.ajax.reload(null, false);
          swal({
            type: 'success',
            title: 'Succès',
            text: "La Facture est Confirmer.",
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
  rejectAll(){
    var title = "Rejeter Article";
    var text = "Vous voulez vraiment Rejeter toutes les Articles de cette Facture!"
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
      this.historyService.rejectAll(HistoryReturnComponent.selectedFactureID).subscribe(Response => {
        this.globalHistoryReturnDT.ajax.reload(null, false);
          swal({
            type: 'success',
            title: 'Succès',
            text: "La Facture est Rejeter.",
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
