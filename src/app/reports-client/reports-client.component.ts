import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-reports-client',
  templateUrl: './reports-client.component.html',
  styleUrls: ['./reports-client.component.css']
})
export class ReportsClientComponent implements OnInit,OnDestroy {
  static globalDataTable: any;

  constructor(
    private router: Router) { }
    ngOnDestroy(): void {
      ReportsClientComponent.globalDataTable.fixedHeader.disable();
    }
  
  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    var clientDataTable = $('#clientReportDataTable').DataTable({
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: "print",
          messageTop: "Client Rapport",
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
      select:true,
      lengthMenu: [[ 100, 200, 400,800], [100, 200, 400,800]],
      ajax: {
        type: "get",
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/report-client.php",
        data: function ( d ) {
          return $.extend( {}, d, {
          } );
        },
        cache: true,
        async: true
      },
      order: [[0, 'asc']],
      columns: [
        { data: "name", title: "Nom Client" },
        { data: "phone", title: "Téléphone" },
        { data: "address", title: "Adresse" },
        { data: "code", title: "Code" }
      ]
    });

    ReportsClientComponent.globalDataTable = clientDataTable;
  }

}
