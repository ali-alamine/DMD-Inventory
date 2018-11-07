import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-history-transfer',
  templateUrl: './history-transfer.component.html',
  styleUrls: ['./history-transfer.component.css']
})
export class HistoryTransferComponent implements OnInit {
  static globalTransDT;
  
  static articleSearch = "";
  static codeSearch = "";
  static dateSearch = "";
  static crtSearch = "";
  static pieceSearch = "";
  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    $("#historyTransferDT thead tr")
    .clone(true)
    .appendTo("#historyTransferDT thead");
  $("#historyTransferDT thead tr:eq(1) th").each(function(i) {
    var title = $(this).text();
    $(this).html(
      '<input class="test123" type="text" placeholder="Rechercher ' +
        title +
        '" />'
    );
    
    $("input", this).on("keyup change", function() {
      if (i == 0) HistoryTransferComponent.dateSearch = this.value;
      else if (i == 1) HistoryTransferComponent.codeSearch = this.value;
      else if (i == 2) HistoryTransferComponent.articleSearch = this.value;
      else if (i == 3) HistoryTransferComponent.crtSearch = this.value;
      else if (i == 4) HistoryTransferComponent.pieceSearch = this.value;
      HistoryTransferComponent.globalTransDT.ajax.reload();
    });
  });
  
    var historyTransferDT = $('#historyTransferDT').DataTable({
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
        url: "http://localhost/DMD-Inventory/src/assets/api/dataTables/historyTransferDT.php",
        data: function(d) {
          return $.extend({}, d, {
            articleSearch: HistoryTransferComponent.articleSearch,
            dateSearch: HistoryTransferComponent.dateSearch,
            codeSearch: HistoryTransferComponent.codeSearch,
            crtSearch: HistoryTransferComponent.crtSearch,
            pieceSearch: HistoryTransferComponent.pieceSearch
          });
        },
        cache: true,
        async: true
      },
      order: [[0, 'desc']],
      columns: [
        { data: "conv_date", title: "DATE" },
        { data: "item_code", title: "CODE" },
        { data: "item_name", title: "ARTICLE" },
        { data: "conv_crt", title: "CRT" },
        { data: "conv_piece", title: "PIECE" }

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
        }
      }
    });
    HistoryTransferComponent.globalTransDT = historyTransferDT;


    
    
    
  }
  ngOnDestroy() {
    HistoryTransferComponent.articleSearch="";
    HistoryTransferComponent.crtSearch="";
    HistoryTransferComponent.pieceSearch="";
    HistoryTransferComponent.codeSearch="";
    HistoryTransferComponent.dateSearch="";
    HistoryTransferComponent.globalTransDT.fixedHeader.disable();
  }

}

