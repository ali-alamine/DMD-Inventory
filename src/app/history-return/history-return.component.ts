import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../history/history.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
declare var $: any;
import swal from 'sweetalert2';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { NavBarService } from '../nav-bar/nav-bar.service';

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
  static selectedFactureCode;
  static selectedFactureDate;
  rightClick2: MenuItem[];
  private globalHistoryReturnDT;
  private globalReturnDetailsDT;
  private itemsForm;
  static selectedFacture = new Array();
  dataComfirm={};
  clientName; clientPhone; clientAddress; dateReq; codeFR;


  constructor(
    private historyService: HistoryService,
    private navBarService :NavBarService,
    private modalService : NgbModal, 
    private fb : FormBuilder,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    this.getHistoryReturnDT();
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
      this.globalHistoryReturnDT = historyReturnDT;
      historyReturnDT.on('select', function (e, dt, type, indexes) {
        HistoryReturnComponent.selectedFacture = [];
        if (type === 'row') {
          this.selectedFactureRowData = historyReturnDT.row(indexes).data();
          HistoryReturnComponent.selectedFactureID = historyReturnDT.row(indexes).data()['invID'];
          HistoryReturnComponent.selectedFactureCode = historyReturnDT.row(indexes).data()['inv_code'];
          HistoryReturnComponent.selectedFactureDate = historyReturnDT.row(indexes).data()['inv_date_req'];

        }
        else if (type === 'column') {
          HistoryReturnComponent.selectedFactureID =-1;
        }
      });
      $('#historyReturnDT tbody').on('mousedown', 'tr', function (event) {
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
    this.modalReference = this.modalService.open(showDetails, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
    this.historyService.getFactureReturnDetails(HistoryReturnComponent.selectedFactureID).subscribe(Response => {
      this.factureDetails = Response;
      this.clientName = this.factureDetails[0].per_name;
      this.clientPhone = this.factureDetails[0].per_phone;
      this.clientAddress = this.factureDetails[0].per_address;
      this.dateReq = HistoryReturnComponent.selectedFactureDate;
      this.codeFR = HistoryReturnComponent.selectedFactureCode;
    }, error => {
      alert(error)
    });
  }
  // confirmOrder(i,ordID,invID,crt,piece,itemID,isDamaged,packingList){
  //   this.dataComfirm['ordID']= ordID;
  //   this.dataComfirm['invID']=invID;
  //   this.dataComfirm['crt']=crt;
  //   this.dataComfirm['piece']=piece;
  //   this.dataComfirm['itemID']=itemID;
  //   this.dataComfirm['isDamaged']=isDamaged;
  //   this.dataComfirm['packingList']=packingList;
  //   this.historyService.confirmOrder(this.dataComfirm).subscribe(Response => {      
  //     this.factureDetails.splice(i, 1);
  //     if(Response == 0) {
  //       this.globalHistoryReturnDT.ajax.reload(null, false);
  //       this.modalReference.close();
  //       NavBarComponent.getCountFR();
  //     } 
  //     swal({
  //       type: 'success',
  //       title: 'Succès',
  //       text: 'Article confirmer.',
  //       showConfirmButton: false,
  //       timer: 1000
  //     });
  //   }, error => {
  //     swal({
  //       type: 'error',
  //       title: error.statusText,
  //       text: error.message
  //     });
  //   });
  // }
  rejectOrder(i,ordID,invID){
    this.historyService.rejectOrder(ordID,invID).subscribe(Response => {
      this.factureDetails.splice(i, 1);
      if(Response == 0) {
        this.globalHistoryReturnDT.ajax.reload(null, false);
        this.modalReference.close();
         this.navBarService.getCountFR().subscribe(Response => {
          this.navBarService.changeCount(Response[0].c);
        });
      } 
      swal({
        type: 'success',
        title: 'Succès',
        text: 'Article rejeter.',
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
    var text = "Vous voulez vraiment confirmer toutes les articles de cette facture!"
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
      this.historyService.confirmAll(HistoryReturnComponent.selectedFactureID).subscribe(Response => {
        this.globalHistoryReturnDT.ajax.reload(null, false);
        this.navBarService.getCountFR().subscribe(Response => {
          this.navBarService.changeCount(Response[0].c);
        });
          swal({
            type: 'success',
            title: 'Succès',
            text: "Toutes les articles sont confirmés.",
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
    var text = "Vous voulez vraiment rejeter toutes les articles de cette facture!"
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
      this.historyService.rejectAll(HistoryReturnComponent.selectedFactureID).subscribe(Response => {
        this.globalHistoryReturnDT.ajax.reload(null, false);
        this.navBarService.getCountFR().subscribe(Response => {
          this.navBarService.changeCount(Response[0].c);
        });
          swal({
            type: 'success',
            title: 'Succès',
            text: "Toutes les articles sont rejetés.",
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
