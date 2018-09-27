import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '../../../node_modules/@angular/forms';
import { HistoryService } from './history.service';
import { MenuItem } from '../../../node_modules/primeng/api';
declare var $: any;
import swal from 'sweetalert2';

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
    this.router.navigate(["history/facture"]);
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
    console.log(facture[0].ID)
    this.historyService.getFactureDetails(facture[0].ID).subscribe(Response => {
      this.factureDetails = Response;
      console.log(this.factureDetails);
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

        ]
        // ,
        // "columnDefs": [
        //   {
        //     "targets": 2,
        //     "data": "type",
        //     "render": function (data, type, row, meta) {
        //       if (data == null) {
        //         return 'Payment';
        //       }
        //       else if (data == 'a') {
        //         return 'Add';
        //       }
        //       else if(data == 'w') {
        //         return 'Withdraw';
        //       }
        //     }
        //   }
        // ]
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
    if(facture['type']=="FD")
      this.showDetailsCode="Show Details Facture Déchargement" ;
    if(facture['type']=="FR")
      this.showDetailsCode="Show Details Facture Retour" ;
    if(facture['type']=="FC")
      this.showDetailsCode="Show Details Facture Client" ;
  }

}
