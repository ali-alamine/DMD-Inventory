import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ClientsService } from '../clients/clients.service';
declare var $: any;
@Component({
  selector: 'app-reports-stock',
  templateUrl: './reports-stock.component.html',
  styleUrls: ['./reports-stock.component.css']
})
export class ReportsStockComponent implements OnInit,OnDestroy {
  panelOpenState = false;
  filterForm;
  private static globalDataTable;

  private static gateSearch=-1;
  static qunatityStatus = -1;
  static deactivated = -1;

  constructor(private fb: FormBuilder) { }
  ngOnDestroy(): void {
    ReportsStockComponent.globalDataTable.fixedHeader.disable();
  }
  ngOnInit() {    
    var stockDT = $('#stockReportDT').DataTable({
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: "print",
          messageTop: "Stock Rapport",
          text: "Imprimer",
          exportOptions: {
            columns: ":visible",
            modifier: {
              selected: null
            }
          }
        },
        {
          extend: "print",
          text: "Imprimer sélectionné"
        },
        {
          extend: "colvis",
          text: "visibilité des colonnes"
        },
        "pageLength",
        "excel"
      ],
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
        },
        buttons: {
          pageLength: {
            _: "Afficher %d éléments",
            "-1": "Tout afficher"
          }
        }
      },
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      searching: false,
      stateSave: false,
      fixedHeader: true,
      select: true,
      lengthMenu: [[ 100, 200, 400,800], [ 100, 200, 400,800]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/report-stock.php",
        data: function ( d ) {
          return $.extend( {}, d, {
            "gate":ReportsStockComponent.gateSearch,
            "qunatityStatus":ReportsStockComponent.qunatityStatus,
            "deactivated":ReportsStockComponent.deactivated
          } );
        },
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "item_name", title: "Article" },
        { data: "item_is_damaged", title: "Gâte" },
        { data: "item_code", title: "Code" },
        { data: "item_packing_list", title: "Colisage" },
        { data: "item_piece", title: "Piece" },
        { data: "crt", title: "CRT" }

      ]
    });
    ReportsStockComponent.globalDataTable=stockDT;
    this.filterForm = this.fb.group({
      status: ['-1'],
      gate: ['-1'],
      deactivated:['-1']
    });
  }
  
  searchSubmit(){    
    ReportsStockComponent.qunatityStatus=this.filterForm.get('status').value;
    ReportsStockComponent.gateSearch=this.filterForm.get('gate').value;
    ReportsStockComponent.deactivated=this.filterForm.get('deactivated').value;
    ReportsStockComponent.globalDataTable.ajax.reload();
  }

}
