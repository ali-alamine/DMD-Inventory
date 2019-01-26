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
  static selectedOrdID;
  rightClick: MenuItem[];
  static globalHistoryItemsDT;
  private globalHistoryItemsDetailsDT;
  private itemsForm;
  static selectedFacture = new Array();
  
  static articleSearch = "";
  static clientSearch = "";
  static codeSearch = "";
  static dateSearch = "";
  static typeSearch = "";
  static crtSearch = "";
  static pieceSearch = "";

  constructor(private historyComponent : HistoryComponent,
    private histoeyService: HistoryService,
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    
      if(HistoryItemsComponent.globalHistoryItemsDT!= null)
      HistoryItemsComponent.globalHistoryItemsDT.ajax.reload(null, false);
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
    // alert("article")
    
  }
  getHistoryItemsDT(){
    $("#historyItemsDT thead tr")
    .clone(true)
    .appendTo("#historyItemsDT thead");
  $("#historyItemsDT thead tr:eq(1) th").each(function(i) {
    var title = $(this).text();
    var name_id="input" + i;
    $(this).html(
      '<input class="test123 '+name_id+'" type="text" placeholder="Rechercher ' +
        title +
        '" />'
    );
    // debugger
    $("input", this).on("keyup change", function() {
      if (i == 0) HistoryItemsComponent.codeSearch = this.value;
      else if (i == 1) HistoryItemsComponent.typeSearch = this.value;
      else if (i == 2) HistoryItemsComponent.articleSearch = this.value;
      else if (i == 3) HistoryItemsComponent.crtSearch = this.value;
      else if (i == 4) HistoryItemsComponent.pieceSearch = this.value;
      else if (i == 5) HistoryItemsComponent.dateSearch = this.value;
      else if (i == 6) HistoryItemsComponent.clientSearch = this.value;
      
      HistoryItemsComponent.globalHistoryItemsDT.ajax.reload();
    });
  });
  
    // if(HistoryItemsComponent.globalHistoryItemsDT==null){
      var historyItemsDT = $('#historyItemsDT').DataTable({
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
          url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/historyItemsDT.php",
          data: function(d) {
            return $.extend({}, d, {
              articleSearch: HistoryItemsComponent.articleSearch,
              dateSearch: HistoryItemsComponent.dateSearch,
              codeSearch: HistoryItemsComponent.codeSearch,
              crtSearch: HistoryItemsComponent.crtSearch,
              pieceSearch: HistoryItemsComponent.pieceSearch,
              clientSearch: HistoryItemsComponent.clientSearch,
              typeSearch: HistoryItemsComponent.typeSearch
            });
          },
          cache: true,
          async: true,
          Response: $('.input2').focus(),
        },
        order: [[0, 'asc']],
        columns: [
          { data: "inv_code", title: "Code" },
          { data: "inv_type", title: "Type" },
          { data: "item_name", title: "Article" },
          { data: "ord_crt", title: "CRT" },
          { data: "ord_piece", title: "Piece" },
          { data: "inv_date_req", title: "Date" },
          { data: "per_name", title: "Client" }

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
        },{
            "targets": 3,
          "createdCell": function (td, data, rowData, row, col) {
            if (rowData['ord_item_isDamaged'] == 1) {    
                  return  rowData['item_name'] + " | GATE" ;
            } else{
              return rowData['item_name'];
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
        }],
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
        historyItemsDT.row(selectedRowLS).select();
        localStorage.removeItem('selectedRow');
      }
  
      if (x !== null && y !== null){
        window.scroll(+x,+y);
        localStorage.removeItem('XOffset');
        localStorage.removeItem('YOffset');
      }
      HistoryItemsComponent.globalHistoryItemsDT = historyItemsDT;
      historyItemsDT.on('select', function (e, dt, type, indexes) {
        HistoryItemsComponent.selectedFacture = [];
        if (type === 'row') {
          localStorage.setItem('selectedRow', indexes);
          HistoryItemsComponent.selectedItemsRowData = historyItemsDT.row(indexes).data();
          HistoryItemsComponent.selectedFactureID = historyItemsDT.row(indexes).data()['invID'];
          HistoryItemsComponent.selectedOrdID = historyItemsDT.row(indexes).data()['ordID'];
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
          HistoryItemsComponent.selectedOrdID = -1;
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
    // } else{
    //   HistoryItemsComponent.globalHistoryItemsDT.ajax.reload(null, false);
    // }
  }
  
  ngOnDestroy() {
    HistoryItemsComponent.clientSearch="";
    HistoryItemsComponent.articleSearch="";
    HistoryItemsComponent.crtSearch="";
    HistoryItemsComponent.pieceSearch="";
    HistoryItemsComponent.typeSearch="";
    HistoryItemsComponent.codeSearch="";
    HistoryItemsComponent.dateSearch="";
    HistoryItemsComponent.globalHistoryItemsDT.fixedHeader.disable();
  }
  openShowDetails() {
    this.historyComponent.showFactureDetails(HistoryItemsComponent.selectedFacture);
  }
  editFacture(){
    localStorage.setItem('XOffset', window.pageXOffset.toString());
    localStorage.setItem('YOffset', window.pageYOffset.toString());
    localStorage.setItem('routerHistory',"history/items");
    if(HistoryItemsComponent.selectedFacture[0].type=="FR")
      this.router.navigate(["facture/return"], { queryParams: { factureID: HistoryItemsComponent.selectedFactureID }});
    if(HistoryItemsComponent.selectedFacture[0].type=="FD")
      this.router.navigate(["facture/supply"], { queryParams: { factureID: HistoryItemsComponent.selectedFactureID }});
    if(HistoryItemsComponent.selectedFacture[0].type=="FC")
      this.router.navigate(["facture/client"], { queryParams: { factureID: HistoryItemsComponent.selectedFactureID }});
  }
  printFacture() {
    this.historyComponent.printFacture(HistoryItemsComponent.selectedFacture);
  }
  deleteItem(){
    var title = "Supprimer Article";
    var text = "Vous voulez vraiment supprimer cette Article!"
    swal({
      title: title,
      html: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui!',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.value) {
        this.histoeyService.deleteItem(HistoryItemsComponent.selectedOrdID,HistoryItemsComponent.selectedFacture[0].type).subscribe(Response => {
          HistoryItemsComponent.globalHistoryItemsDT.ajax.reload(null, false);
          swal({
            type: 'success',
            title: 'Succès',
            text: "L'article est bien supprimer du facture.",
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
  