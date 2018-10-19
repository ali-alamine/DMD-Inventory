import { Component, OnInit, ViewChild, TemplateRef, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { HistoryService } from './history.service';
import { MenuItem } from 'primeng/api';
import { HistoryItemsComponent } from '../history-items/history-items.component';
import { HistoryFactureComponent } from '../history-facture/history-facture.component';
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
  clientName; clientPhone; clientAddress; dateReq; code; type;
  badgeCount: number;
  // private zone: NgZone;

  constructor(private historyService: HistoryService,
    private modalService: NgbModal,
    private router: Router, 
    private fb: FormBuilder,
    private zone: NgZone) { 
      zone.runOutsideAngular(() => {
      // this.printPage();
      // setInterval(() => {
        // this.time = Date.now();

        // lc.tick(); // comment this line and "time" will stop updating
      // }, 1000);
    }) 
  }

  ngOnInit() {
    if (localStorage.getItem("user") !== '1') {
      this.router.navigate(["login"]);
    }
    this.getCountFR();
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
        order: [[0, 'desc']],
        columns: [

          { data: "item_name", title: "ARTICLE" },
          { data: "ord_crt", title: "CRT" ,"searchable": false,"sortable": false},
          { data: "ord_piece", title: "PIECE","searchable": false,"sortable": false },
          { data: "ord_note", title: "NOTE" ,"searchable": false,"sortable": false},
        ]
      });
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
  getCountFR(){
    this.historyService.getCountFR().subscribe(Response => {
      this.badgeCount=Response[0].c;
    });
  }

  printFacture(facture) {
    this.historyService.getFactureDetails(facture[0].ID,facture[0].type).subscribe(Response => {
      this.clientName = facture[0].clientName;
      this.clientPhone = facture[0].phone;
      this.clientAddress = facture[0].address;
      this.dateReq = facture[0].date_req;
      this.code = facture[0].code;
      this.type = facture[0].type;
      this.zone.run(() => {
        // this.factureDetails;
        this.factureDetails = Response;
      });
      this.printPage();
    }, error => {
      alert(error)
    });

}
// run(fn, applyThis, applyArgs) {
//   return this._inner.run(fn, applyThis, applyArgs);
// }
printPage(){
  console.log(this.factureDetails)
  // console.log($('#printFacture').html())
  var printContents = document.getElementById('printFacture').innerHTML;
  var popupWin = window.open('', '_blank', 'width=800,height=600');
  popupWin.document.open();
  popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="../../styles.css"></head><body onload="window.print()">' + printContents + '</body></html>');
  popupWin.document.close();
  setTimeout(function(){ popupWin.close(); }, 1000);
  }
}
