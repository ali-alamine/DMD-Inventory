import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { HistoryService } from './history.service';
import { MenuItem } from 'primeng/api';
declare var $: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  currentUrl: string;
  private modalReference: any;
  rightClick: MenuItem[];
  factureDetails;
  showDetailsCode;
  private selectedFactureDetailsRowData;
  private selectedFactureDetailsID;
  private globalHistoryFactureDetailsDT;
  @ViewChild('showDetails')
  private showDetailsTPL : TemplateRef<any>;
  clientName; clientPhone; clientAddress; dateReq; code; type;dateDel;
  // badgeCount: number;

  constructor(private historyService: HistoryService,
    private modalService: NgbModal,
    public router: Router, 
    private fb: FormBuilder) {  
  }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    // this.getCountFR();
    var router = localStorage.getItem('routerHistory');
    if (router !== null){
      this.router.navigate([router]);
      localStorage.removeItem('routerHistory');
    } else{
      this.router.navigate(["history/facture"]);
    }
    this.rightClick = [
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
  showFactureDetails(facture) {
    this.modalReference = this.modalService.open(this.showDetailsTPL, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
    this.historyService.getFactureDetails(facture[0].ID,facture[0].type).subscribe(Response => {
      this.factureDetails = Response;
      this.clientName = facture[0].clientName;
      this.clientPhone = facture[0].phone;
      this.clientAddress = facture[0].address;
      this.dateReq = facture[0].date_req;
      this.dateDel = facture[0].date_del;
      this.code = facture[0].code;
      this.type = facture[0].type;
      if(facture[0].type=="FD"){
        this.showDetailsCode="Afficher les détails du facture Déchargement" ;
      }
      if(facture[0].type=="FR"){
        this.showDetailsCode="Afficher les détails du facture Retour" ;
      }
      if(facture[0].type=="FC"){
        this.showDetailsCode="Afficher les détails du facture Client" ;
      }
      if(facture[0].type=="FR"){
        var factureDetailDT = $('#detailFactureDT').DataTable({
        responsive: true,
        paging: false,
        lengthChange:false,
        serverSide: false,
        processing: true,
        select: {
          "style": "single"
        },
        ordering: true,
        stateSave: false,
        fixedHeader: false,
        searching: true,
        data: this.factureDetails,
        order: [[0, 'asc']],
        columns: [

          { data: "item_name", title: "ARTICLE" },
          { data: "ord_crt", title: "CRT" ,"searchable": false,"sortable": false},
          { data: "ord_piece", title: "PIECE","searchable": false,"sortable": false },
          { data: "ord_note", title: "NOTE" ,"searchable": false,"sortable": false},
          { data: "ord_date_com", title: "Date de confirme" ,"searchable": false,"sortable": false},
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
      } else{
        var factureDetailDT = $('#detailFactureDT').DataTable({
          responsive: true,
          paging: false,
          lengthChange:false,
          serverSide: false,
          processing: true,
          select: {
            "style": "single"
          },
          ordering: true,
          stateSave: false,
          fixedHeader: false,
          searching: true,
          data: this.factureDetails,
          order: [[0, 'asc']],
          columns: [
  
            { data: "item_name", title: "ARTICLE" },
            { data: "ord_crt", title: "CRT" ,"searchable": false,"sortable": false},
            { data: "ord_piece", title: "PIECE","searchable": false,"sortable": false },
            { data: "ord_note", title: "NOTE" ,"searchable": false,"sortable": false},
            // { data: "ord_det_com", title: "Date de confirmation" ,"searchable": false,"sortable": false},
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
      }
      this.globalHistoryFactureDetailsDT = factureDetailDT;
      $('#factureDetailDT tbody').on('mousedown', 'tr', function (event) {
        if (event.which == 3) {
          factureDetailDT.row(this).select();
        }
      });
      $('#factureDetailDT').on('key-focus.dt', function (e, datatable, cell) {
        $(factureDetailDT.row(cell.index().row).node()).addClass('selected');

      });
      $('#factureDetailDT').on('key-blur.dt', function (e, datatable, cell) {
        $(factureDetailDT.row(cell.index().row).node()).removeClass('selected');
      });
    }, error => {
      alert(error)
    });
  }
  printFacture(facture) {
    this.historyService.getFactureDetails(facture[0].ID,facture[0].type).subscribe(Response => {
      this.factureDetails = Response;
      this.clientName = facture[0].clientName;
      this.clientPhone = facture[0].phone;
      this.clientAddress = facture[0].address;
      this.dateReq = facture[0].date_req;
      this.dateDel = facture[0].date_del;
      this.code = facture[0].code;
      this.type = facture[0].type;
      if(this.factureDetails!= null)
        this.printPage();
    }, error => {
      alert(error)
    });

}
  printPage(){
  var html='';
  if(this.type == "FC"){
    html = html + '<div class="table table-striped noselect" id="printFacture">'+
    '<div style="float:left;">'+
      '<b>Nom:</b> '+this.clientName+'<br>'+
      '<b>Téléphone:</b> '+this.clientPhone+'<br>'+
      '<b>Adresse:</b> '+this.clientAddress+
    '</div>'+
    '<div style="float: right;">'+
      '<b>Date De Commande:</b> '+this.dateReq+'<br>'+
      '<b>Date De Livraison:</b> '+this.dateDel+'<br>'+
      '<b>Code:</b> '+this.code+
    '</div>'+
    '<br><br><br><hr>';
  } else if(this.type == 'FR'){
    html = html + '<div class="table table-striped noselect" id="printFacture">'+
    '<div style="float:left;">'+
      '<b>Nom:</b> '+this.clientName+'<br>'+
      '<b>Téléphone:</b> '+this.clientPhone+'<br>'+
      '<b>Adresse:</b> '+this.clientAddress+
    '</div>'+
    '<div style="float: right;">'+
      '<b>Date De Commande:</b> '+this.dateReq+'<br>'+
      '<b>Code:</b> '+this.code+
    '</div>'+
    '<br><br><br><hr>';
  }else{
    html = html + '<div class="table table-striped noselect" id="printFacture">'+
    '<div style="float: right;">'+
      '<b>Date De Commande:</b> '+this.dateReq+'<br>'+
      '<b>Code:</b> '+this.code+
    '</div>'+
    '<br><br><br><hr>';

  }
  if(this.type == 'FR'){
    html = html +'<table class="table table-responsive table-bordered text-center test noselect" style="width:100%;  border-collapse: collapse; border: 1px solid black;">'+
                  '<thead>'+
                  '<tr>'+
                  '<th style="border: 1px solid black;" class="text-center mousetrap" rowspan="2">ARTICLES</th>'+
                  '<th style="border: 1px solid black;" class="text-center mousetrap" colspan="2">QUANTITE</th>'+
                  '<th style="border: 1px solid black;" class="text-center mousetrap" rowspan="2">P.Unit</th>'+
                  '<th style="border: 1px solid black;" class="text-center mousetrap" rowspan="2">Montant</th>'+
                  '<th style="border: 1px solid black;" class="text-center mousetrap" rowspan="2">Date de confirme</th>'+
                      '</tr>'+
                      '<tr>'+
                          '<th style="border: 1px solid black;" class="text-center mousetrap">CLS/CRT</th>'+
                          '<th style="border: 1px solid black;" class="text-center mousetrap">PIECE</th>'+
                      '</tr>'+
                  '</thead>'+
                '<tbody>';
    this.factureDetails.forEach(element => {
      html = html + '<tr><td style="border: 1px solid black;">'+element.item_name+'</td>'+
                  '<td style="border: 1px solid black;">'+element.ord_crt+'</td>'+
                  '<td style="border: 1px solid black;">'+element.ord_piece+'</td>'+
                  '<td style="border: 1px solid black;"></td>'+
                  '<td style="border: 1px solid black;"></td>'+
                  '<td style="border: 1px solid black;">'+element.ord_date_com+'</td></tr>';
    });
  }else{
    html = html +'<table class="table table-responsive table-bordered text-center test noselect" style="width:100%;  border-collapse: collapse; border: 1px solid black;">'+
    '<thead>'+
    '<tr>'+
    '<th style="border: 1px solid black;" class="text-center mousetrap" rowspan="2">ARTICLES</th>'+
    '<th style="border: 1px solid black;" class="text-center mousetrap" colspan="2">QUANTITE</th>'+
    '<th style="border: 1px solid black;" class="text-center mousetrap" rowspan="2">P.Unit</th>'+
            '<th style="border: 1px solid black;" class="text-center mousetrap" rowspan="2">Montant</th>'+
        '</tr>'+
        '<tr>'+
            '<th style="border: 1px solid black;" class="text-center mousetrap">CLS/CRT</th>'+
            '<th style="border: 1px solid black;" class="text-center mousetrap">PIECE</th>'+
        '</tr>'+
    '</thead>'+
  '<tbody>';
this.factureDetails.forEach(element => {
html = html + '<tr><td style="border: 1px solid black;">'+element.item_name+'</td>'+
    '<td style="border: 1px solid black;">'+element.ord_crt+'</td>'+
    '<td style="border: 1px solid black;">'+element.ord_piece+'</td>'+
    '<td style="border: 1px solid black;"></td>'+
    '<td style="border: 1px solid black;"></td></tr>';
});
  }
html =html +'</tbody>'+
            '</table>'+ 
            '<hr>'+
            '<div style="float:left;" class="noselect">'+
            '<label style="font-size: 13px;">Le Responseble</label>'+
            '<label>----------------------</label>'+
            '</div>'+
            '<div style="float:right;" class="noselect">'+
            '<label style="font-size: 13px;">Num de cls/crt</label>'+
            '<label>-----------------------</label>'+
            '</div>'+
            '<br>'+
            '<br>'+
            '<div style="float:left;" class="noselect">'+
                  '<label style="font-size: 13px;">Le Client</label>'+
                  '<label>-----------------------</label>'+
              '</div>'+
            '<div  style="float:right;" class="noselect">'+
            '<label style="font-size: 13px;">Num de piece</label>'+
            '<label>-----------------------</label>'+
            '</div>'+
            '</div></div>';
  var popupWin = window.open('', '_blank', 'width=800,height=600');
  popupWin.document.open();
  popupWin.document.write('<html><body onload="window.print()">'+ html +'</body></html>');
  popupWin.document.close();
  setTimeout(function(){ popupWin.close(); }, 1000);
  }
}
