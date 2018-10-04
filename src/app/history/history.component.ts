import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
  name; phone;address;date_del;date_req;code;
  info_client;info_code_date;
  // showDetails:any;
  private selectedFactureDetailsRowData;
  private selectedFactureDetailsID;
  private globalHistoryFactureDetailsDT;
  @ViewChild('showDetails')
  private showDetailsTPL : TemplateRef<any>;
  

  constructor(private historyService: HistoryService,
    private modalService: NgbModal,
    private router: Router, 
    private fb: FormBuilder) { }

  ngOnInit() {
    var router = localStorage.getItem('routerHistory');
    if (router !== null){
      this.router.navigate([router]);
      localStorage.removeItem('routerHistory');
    }
    else{
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
    // console.log(facture[0].ID)
    this.historyService.getFactureDetails(facture[0].ID,facture[0].type).subscribe(Response => {
      this.factureDetails = Response;
      // console.log(this.factureDetails);
      var factureDetailDT = $('#detailFactureDT').DataTable({
        responsive: true,
        paging: false,
        // pagingType: "full_numbers",
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
        // lengthMenu: [[25, 50, 100], [25, 50, 100]],
        data: this.factureDetails,
        order: [[0, 'desc']],
        columns: [

          { data: "item_name", title: "ARTICLE" },
          { data: "ord_crt", title: "CRT" ,"searchable": false,"sortable": false},
          { data: "ord_piece", title: "PIECE","searchable": false,"sortable": false },
          { data: "ord_note", title: "NOTE" ,"searchable": false,"sortable": false},
          // { data: "ord_date_req", title: "DATE DE COMMANDE" ,"searchable": false,"sortable": false},
          // { data: "ord_date_del", title: "DATE DE LIVRAISON" ,"searchable": false,"sortable": false},
        ],"columnDefs": [ {
          "targets": 0,
          "render": function (td, data, rowData, row, col) {
            if (rowData['ord_item_isDamaged'] == 1) {    
                  return  rowData['item_name'] + " | GATE" ;
            } else{
              return rowData['item_name'];
            }
        } 
        }]
        // createdRow: function (row, data, index) {
        //   if (data['ord_item_isDamaged'] == 1) {    
        //     return         
        //     $(row).addClass("bg-warning");
        //     $(row).attr('title', " CRT: " + data['crtD'] + " || Piece: " + data['pieceD']);    
        //   }
        // }
        // ,"columnDefs": [ {
        //   "targets": 1,
        //   "createdCell": function (td, cellData, rowData, row, col) {
            
        //     if ( rowData['isDamagedFlag']) {              
        //       $(td).html(cellData+" <i style='float:right; color: #FF0000;' md-18 class='material-icons'>new_releases</i> ")
        //     }
        //   }
        // } ],
        // createdRow: function (row, data, index) {
        //   if (data['isDamagedFlag'] == 1) {            
        //     $(row).addClass("bg-warning");
        //     $(row).attr('title', " CRT: " + data['crtD'] + " || Piece: " + data['pieceD']);    
        //   }
        // }
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
    this.modalReference = this.modalService.open(this.showDetailsTPL, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
    if(facture[0].type=="FD"){
      this.showDetailsCode="Show Details Facture Déchargement" ;
      this.info_client="";
      this.info_code_date="Date de Commande: " + facture[0].date_req + "\n Code: "+facture[0].code;
    }
    if(facture[0].type=="FR"){
      this.showDetailsCode="Show Details Facture Retour" ;
      this.info_client="Client: " + facture[0].clientName + "\n Phone: " + facture[0].phone + "\n Address: "+facture[0].address;
      this.info_code_date="Code: "+facture[0].code;
    }
    if(facture[0].type=="FC"){
      this.showDetailsCode="Show Details Facture Client" ;
      this.info_client="Client: " + facture[0].clientName + "\n Phone: " + facture[0].phone + "\n Address: "+facture[0].address;
      this.info_code_date="Date de Commande: " + facture[0].date_req + "\n Date de Livraison: " + facture[0].date_del + "\n Code: "+facture[0].code;
      // Client: {{clientName}}\nPhone: {{phone}}\nAddress: {{address}}
      // Date de Commande: {{date_req}}\nDate de Livraison: {{date_del}}\nCode: {{code}}
    }
    // this.name=facture[0].clientName; 
    // this.phone=facture[0].phone;
    // this.address=facture[0].address;
    // this.date_req=facture[0].date_req;
    // this.date_del=facture[0].date_del;
    // this.code=facture[0].code;
  }

}
