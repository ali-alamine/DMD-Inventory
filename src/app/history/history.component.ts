import { Component, OnInit } from '@angular/core';
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
  static rightClick2: MenuItem[];
  static factureDetails;
  

  constructor(private historyService: HistoryService,
    private modalService: NgbModal,private router: Router, 
    private fb: FormBuilder) { }

  ngOnInit() {
    this.router.navigate(["history/facture"]);
    HistoryComponent.rightClick2 = [
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
  showFactureDetails(id,showDetails) {
    console.log(id)
    // const hs = this.historyService;
    // alert(hs.getFactureDetails(id))
    this.historyService.getFactureDetails(id).subscribe(Response => {
      // this.factureDetails = Response;
      // console.log(this.factureDetails);
      // var detailFactureDT = $('#detailFactureDT').DataTable({
      //   responsive: true,
      //   paging: true,
      //   pagingType: "full_numbers",
      //   serverSide: false,
      //   processing: true,
      //   select: {
      //     "style": "single"
      //   },
      //   ordering: true,
      //   stateSave: false,
      //   fixedHeader: false,
      //   searching: true,
      //   lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
      //   // data: this.factureDetails,
      //   order: [[0, 'desc']],
      //   columns: [

      //     { data: "itemsName", title: "ARTICLE" },
      //     { data: "crt", title: "CRT" ,"searchable": false,"sortable": false},
      //     { data: "piece", title: "PIECE","searchable": false,"sortable": false },
      //     // { data: "piece", title: "PIECE","searchable": false,"sortable": false },
      //     { data: "note", title: "NOTE" ,"searchable": false,"sortable": false},

      //   ],
      //   "columnDefs": [
      //     {
      //       "targets": 2,
      //       "data": "type",
      //       "render": function (data, type, row, meta) {
      //         if (data == null) {
      //           return 'Payment';
      //         }
      //         else if (data == 'a') {
      //           return 'Add';
      //         }
      //         else if(data == 'w') {
      //           return 'Withdraw';
      //         }
      //       }
      //     }
      //   ]
      // });
      // $('#detailFactureDT tbody').on('mousedown', 'tr', function (event) {
      //   if (event.which == 3) {
      //     detailFactureDT.row(this).select();
      //   }
      // });

      // $('#detailFactureDT').on('key-focus.dt', function (e, datatable, cell) {
      //   $(detailFactureDT.row(cell.index().row).node()).addClass('selected');

      // });
      // $('#detailFactureDT').on('key-blur.dt', function (e, datatable, cell) {
      //   $(detailFactureDT.row(cell.index().row).node()).removeClass('selected');
      // });

    }, error => {
      alert(error)
    });
    this.modalReference = this.modalService.open(showDetails, { centered: true, ariaLabelledBy: 'modal-basic-title', size: 'lg' });
    // this.showDetailsCode="Show Details " + AccessoriesDrawerComponent.selectedDay;
  }

}
