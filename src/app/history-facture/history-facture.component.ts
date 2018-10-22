import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../history/history.service';
import { HistoryFactureService } from './history-facture.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/api';
declare var $: any;
import swal from 'sweetalert2';
import { HistoryComponent } from '../history/history.component';
import { FactureComponent } from '../facture/facture.component';
import { Router } from '@angular/router';

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
  rightClick: MenuItem[];
  static globalHistoryFactureDT;
  private itemsForm;
  static selectedFacture = new Array();
  static nameSearch = "";
  static codeSearch = "";
  static dateSearch = "";

  constructor(private historyComponent : HistoryComponent,
    private historyService: HistoryService,
    private modalService : NgbModal, 
    private fb : FormBuilder,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
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
        label: 'Imprimer',
        icon: 'pi pi-fw pi-print',
        command: (event) => {
          let element: HTMLElement = document.getElementById('printBtn') as HTMLElement;
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
  getHistoryFactureDT(){
    $("#historyFactureDT thead tr")
    .clone(true)
    .appendTo("#historyFactureDT thead");
  $("#historyFactureDT thead tr:eq(1) th").each(function(i) {
    var title = $(this).text();
    $(this).html(
      '<input class="test123" type="text" placeholder="Rechercher ' +
        title +
        '" />'
    );
    $("input", this).on("keyup change", function() {
      if (i == 0) HistoryFactureComponent.nameSearch = this.value;
      else if (i == 1) HistoryFactureComponent.dateSearch = this.value;
      else if (i == 2) HistoryFactureComponent.codeSearch = this.value;
      HistoryFactureComponent.globalHistoryFactureDT.ajax.reload();
    });
  });
  
    // if(HistoryFactureComponent.globalHistoryFactureDT==null){

      var historyFactureDT = $('#historyFactureDT').DataTable({
        responsive: false,
      orderCellsTop: true,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      searching: false,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: {
        style: "single"
      },
      lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
          url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/historyDT.php",
          data: function(d) {
            return $.extend({}, d, {
              show: "facture",
              nameSearch: HistoryFactureComponent.nameSearch,
              dateSearch: HistoryFactureComponent.dateSearch,
              codeSearch: HistoryFactureComponent.codeSearch
            });
          },
          cache: true,
          async: true
        },
        order: [[0, 'asc']],
        columns: [
          { data: "per_name", title: "CIENT" },
          { data: "inv_date_req", title: "DATE"},
          { data: "inv_code", title: "CODE"}
        ],
        "columnDefs": [ {
          "targets": 2,
          "createdCell": function (td, data, rowData, row, col) {
            if ( rowData['inv_type'] == "FC") {           
              $(td).html(" <span style='color: 	#008000;' >"+data+"</span> ")
            }
            if ( rowData['inv_type'] == "FR") {           
              $(td).html(" <span style='color: #FF0000;' >"+data+"</span> ")
            }
            if ( rowData['inv_type'] == "FD") {          
              $(td).html(" <span style='color: #0000FF;' >"+data+"</span> ")
            } 
          }
        } ],
        language: {
          "sProcessing":     "Traitement en cours...",
          "sSearch":         "Rechercher&nbsp;:",
          "sLengthMenu":     "Afficher _MENU_ &eacute;l&eacute;ments",
          "sInfo":           "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
          "sInfoEmpty":      "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
          "sInfoFiltered":   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
          "sInfoPostFix":    "",
          "sLoadingRecords": "Chargement en cours...",
          "sZeroRecords":    "Aucun &eacute;l&eacute;ment &agrave; afficher",
          "sEmptyTable":     "Aucune donn&eacute;e disponible dans le tableau",
          "oPaginate": {
              "sFirst":      "Premier",
              "sPrevious":   "Pr&eacute;c&eacute;dent",
              "sNext":       "Suivant",
              "sLast":       "Dernier"
          },
          "oAria": {
              "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
              "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
          },
          "select": {
                  "rows": {
                      _: "%d lignes séléctionnées",
                      0: "Aucune ligne séléctionnée",
                      1: "1 ligne séléctionnée"
                  } 
          }
        }
      });
      var selectedRowLS = localStorage.getItem('selectedRow');
      var x = localStorage.getItem('XOffset');
      var y = localStorage.getItem('YOffset');
      if (selectedRowLS !== null){
        historyFactureDT.row(selectedRowLS).select();
        localStorage.removeItem('selectedRow');
      }
  
      if (x !== null && y !== null){
        window.scroll(+x,+y);
        localStorage.removeItem('XOffset');
        localStorage.removeItem('YOffset');
      }
      HistoryFactureComponent.globalHistoryFactureDT = historyFactureDT;
      historyFactureDT.on('select', function (e, dt, type, indexes) {
        HistoryFactureComponent.selectedFacture = [];
        if (type === 'row') {
          localStorage.setItem('selectedRow', indexes);
          this.selectedFactureRowData = historyFactureDT.row(indexes).data();
          HistoryFactureComponent.selectedFactureID = historyFactureDT.row(indexes).data()['invID'];
          var ID = historyFactureDT.row(indexes).data()['invID'];
          var type = historyFactureDT.row(indexes).data()['inv_type'];
          var clientName = historyFactureDT.row(indexes).data()['per_name'];
          var phone = historyFactureDT.row(indexes).data()['per_phone'];
          var address = historyFactureDT.row(indexes).data()['per_address'];
          var date_req = historyFactureDT.row(indexes).data()['inv_date_req'];
          var date_del = historyFactureDT.row(indexes).data()['inv_date_del'];
          var code = historyFactureDT.row(indexes).data()['inv_code'];
          HistoryFactureComponent.selectedFacture.push({
            ID:ID,
            type:type,
            clientName:clientName,
            phone:phone,
            address:address,
            date_req:date_req,
            date_del:date_del,
            code:code
          });

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

    // } else{
    //   HistoryFactureComponent.globalHistoryFactureDT.ajax.reload(null, false);
    // }
  }
  ngOnDestroy() {
    HistoryFactureComponent.nameSearch="";
    HistoryFactureComponent.codeSearch="";
    HistoryFactureComponent.dateSearch="";
    HistoryFactureComponent.globalHistoryFactureDT.fixedHeader.disable();
  }
  openShowDetails() {
    this.historyComponent.showFactureDetails(HistoryFactureComponent.selectedFacture);
  }
  printFacture() {
    this.historyComponent.printFacture(HistoryFactureComponent.selectedFacture);
  }
  editFacture(){
    localStorage.setItem('XOffset', window.pageXOffset.toString());
    localStorage.setItem('YOffset', window.pageYOffset.toString());
    localStorage.setItem('routerHistory',"history/facture");
    if(HistoryFactureComponent.selectedFacture[0].type=="FR"){
      this.router.navigate(["facture/return"], { queryParams: { factureID: HistoryFactureComponent.selectedFactureID }});
    }
    if(HistoryFactureComponent.selectedFacture[0].type=="FD"){
      this.router.navigate(["facture/supply"], { queryParams: { factureID: HistoryFactureComponent.selectedFactureID }});

    }
    if(HistoryFactureComponent.selectedFacture[0].type=="FC"){
      this.router.navigate(["facture/client"], { queryParams: { factureID: HistoryFactureComponent.selectedFactureID }});

    }
  }
  deleteFacture(){
    swal({
      title: "Supprimer Facture",
      html: "Vous voulez vraiment supprimer cette Facture!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui!',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
        this.historyService.deleteFacture(HistoryFactureComponent.selectedFactureID,HistoryFactureComponent.selectedFacture[0].type).subscribe(Response => {
          if(Response!=0){
            HistoryFactureComponent.globalHistoryFactureDT.ajax.reload(null, false);
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
   
}
