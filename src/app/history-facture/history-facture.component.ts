import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../history/history.service';
import { HistoryFactureService } from './history-facture.service';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '../../../node_modules/@angular/forms';
import { MenuItem } from '../../../node_modules/primeng/api';
declare var $: any;
import swal from 'sweetalert2';
import { HistoryComponent } from '../history/history.component';
import { FactureComponent } from '../facture/facture.component';
import { Router } from '../../../node_modules/@angular/router';
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
  private selectedFactureRowData;
  static selectedFactureID;
  static selectedFactureType;
  static selectedFactureCode;
  static selectedFactureClientName;
  rightClick: MenuItem[];
  private globalHistoryFactureDT;
  private itemsForm;
  // historyComponent: any;
  static selectedFacture = new Array();

  constructor(private historyComponent : HistoryComponent,
    // private factureComponent : FactureComponent,
    private historyService: HistoryService,
    private historyFactureService : HistoryFactureService,
    private modalService : NgbModal, 
    private fb : FormBuilder,
    private router: Router) { }

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
          url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/history.php",
          // data:{"type":"OF"},
          cache: false,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          { data: "client_name", title: "CLIENTS" },
          { data: "ord_det_date_req", title: "DATE" },
          { data: "ord_det_code", title: "CODE"}
        ],
        "columnDefs": [ {
          "targets": 2,
          "createdCell": function (td, data, rowData, row, col) {
            if ( rowData['ord_det_type'] == "FC") {           
              $(td).html(" <span style='color: 	#008000;' >"+data+"</span> ")
            }
            if ( rowData['ord_det_type'] == "FR") {           
              $(td).html(" <span style='color: #FF0000;' >"+data+"</span> ")
            }
            if ( rowData['ord_det_type'] == "FD") {          
              $(td).html(" <span style='color: #0000FF;' >"+data+"</span> ")
            } 
          }
        } ]
      });
      this.globalHistoryFactureDT = historyFactureDT;
      historyFactureDT.on('select', function (e, dt, type, indexes) {
        HistoryFactureComponent.selectedFacture = [];
        if (type === 'row') {
          this.selectedFactureRowData = historyFactureDT.row(indexes).data();
          var ID = historyFactureDT.row(indexes).data()['ID'];
          var type = historyFactureDT.row(indexes).data()['ord_det_type'];
          var clientName = historyFactureDT.row(indexes).data()['client_name'];
          var phone = historyFactureDT.row(indexes).data()['client_phone'];
          var address = historyFactureDT.row(indexes).data()['client_location'];
          var date_req = historyFactureDT.row(indexes).data()['ord_det_date_req'];
          var date_del = historyFactureDT.row(indexes).data()['ord_det_date_del'];
          HistoryFactureComponent.selectedFacture.push({
            ID:ID,
            type:type,
            clientName:clientName,
            phone:phone,
            address:address,
            date_req:date_req,
            date_del:date_del
          });
          // console.log(HistoryFactureComponent.selectedFacture)
        }
        // else if (type === 'column') {
        //   HistoryFactureComponent.selectedFactureID = -1;
        //   HistoryFactureComponent.selectedFactureType = -1;
        // }
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
  openShowDetails() {
    // console.log(HistoryFactureComponent.selectedFactureID)

    this.historyComponent.showFactureDetails(HistoryFactureComponent.selectedFacture);
  }
  editFacture(){
    this.router.navigate(["facture"], { queryParams: { factureID: HistoryFactureComponent.selectedFactureID }});

    // this.factureComponent.ngOnInit();
  }
   
}
