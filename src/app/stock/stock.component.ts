import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { StockService } from "./stock.service";
import { MenuItem } from "primeng/api";
import Swal from "sweetalert2";
import swal from "sweetalert2";
import { Router } from "../../../node_modules/@angular/router";
declare var $: any;

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"]
})
export class StockComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.globalStocksDT.fixedHeader.disable();
  }
  modalReference: any;
  private stockForm;
  private transferForm;
  stockModalTitle;
  editFlag = false;
  private static selectedRowData;
  private static selectedStockID;
  editedStockData = {};
  items: MenuItem[];
  private globalStocksDT;
  data: any;
  labels: Array<String> = [];
  data1: Array<String> = [];
  data2: Array<String> = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private stockService: StockService
  ) {
    
  }

  ngOnInit() {
    if (localStorage.getItem("user") !== "1") {
      this.router.navigate(["login"]);
    }
    var subscriberDataTable = $("#stocksDT").DataTable({
      responsive: false,
      paging: true,
      pagingType: "full_numbers",
      serverSide: true,
      processing: true,
      ordering: true,
      stateSave: false,
      fixedHeader: true,
      select: {
        style: "single"
      },
      searching: true,
      lengthMenu: [[25, 50, 100, 150, 200, 300], [25, 50, 100, 150, 200, 300]],
      ajax: {
        type: "get",
        url:
          "http://localhost/DMD-Inventory/src/assets/api/dataTables/stockDataTable.php",
        data: {},
        cache: true,
        async: true
      },
      order: [[4, "asc"]],
      columns: [
        { data: "pck_list", title: "Colisage" },
        { data: "name", title: "Article" },
        { data: "crt", title: "CRT" },
        { data: "piece", title: "Piece" },
        { data: "code", title: "Code" }
      ],
      columnDefs: [
        {
          targets: 1,
          createdCell: function(td, cellData, rowData, row, col) {
            if (rowData["isDamagedFlag"] && rowData["pieceD"] != 0 && rowData["crtD"] != 0 ) {
              $(td).html(
                cellData +
                  " <i style='float:right; color: #FF0000;' md-18 class='material-icons'>new_releases</i> "
              );
            }
          }
        }
      ],
      createdRow: function(row, data, index) {
        if (data["isDamagedFlag"] == 1 && data["pieceD"] != 0 && data["crtD"] != 0) {
          $(row).addClass("text-danger");
          $(row).attr(
            "title",
            " CRT: " + data["crtD"] + " || Piece: " + data["pieceD"]
          );
        }
      }
    });

    this.items = [
      {
        label: "Modifier",
        icon: "pi pi-fw pi-pencil",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "editStockBtn"
          ) as HTMLElement;
          element.click();
        }
      },
      {
        label: "Transfert",
        icon: "pi pi-fw pi-clone",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "transferBtn"
          ) as HTMLElement;
          element.click();
        }
      },
      {
        label: "Effacer",
        icon: "pi pi-fw pi-times",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "deleteBtn"
          ) as HTMLElement;
          element.click();
        }
      },
      {
        label: "Chart",
        icon: "pi pi-fw pi-calendar",
        command: event => {
          let element: HTMLElement = document.getElementById(
            "chartBtn"
          ) as HTMLElement;
          element.click();
        }
      }
    ];
    this.globalStocksDT = subscriberDataTable;

    subscriberDataTable.on("select", function(e, dt, type, indexes) {
      if (type === "row") {
        StockComponent.selectedRowData = subscriberDataTable
          .row(indexes)
          .data();
        var data = subscriberDataTable.row(indexes).data()["id"];
        StockComponent.selectedStockID = data;
      } else if (type === "column") {
        StockComponent.selectedStockID = -1;
      }
    });

    $("#stocksDT tbody").on("mousedown", "tr", function(event) {
      if (event.which == 3) {
        subscriberDataTable.row(this).select();
      }
    });

    $("#stocksDT").on("key-focus.dt", function(e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).addClass("selected");
    });
    $("#stocksDT").on("key-blur.dt", function(e, datatable, cell) {
      $(subscriberDataTable.row(cell.index().row).node()).removeClass(
        "selected"
      );
    });
  }

  openStockModal(stockModal) {
    this.modalReference = this.modalService.open(stockModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });
    var name = "";
    var colisage = "";
    this.stockModalTitle = "Ajouter ";

    if (this.editFlag == true) {
      this.stockModalTitle = "Modifier ";
      name = StockComponent.selectedRowData["name"];
      colisage = StockComponent.selectedRowData["pck_list"];
    }
    this.stockForm = this.fb.group({
      name: [name, [Validators.required, Validators.minLength(3)]],
      colisage: [colisage, [Validators.required]]
    });
  }

  openTransferModal(transferModal) {
    this.modalReference = this.modalService.open(transferModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });

    this.transferForm = this.fb.group({
      itemID: [StockComponent.selectedStockID, Validators.required],
      colisage: [StockComponent.selectedRowData["pck_list"]],
      itemCode: [StockComponent.selectedRowData["code"]],
      itemName: [StockComponent.selectedRowData["name"]],
      crt: [0],
      piece: [0]
    });
  }

  submitTransfer() {
    this.stockService.transfer(this.transferForm.value).subscribe(
      Response => {
        this.globalStocksDT.ajax.reload(null, false);
        Swal({
          type: "success",
          title: "Success",
          text: "damaged items transfered Successfully",
          showConfirmButton: false,
          timer: 1000
        });
      },
      error => {
        Swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );

    this.modalReference.close();
  }

  addEditStock() {
    if (this.editFlag == true) {
      this.editedStockData["name"] = this.name.value;
      this.editedStockData["pck_list"] = this.colisage.value;
      this.editedStockData["ID"] = StockComponent.selectedStockID;
      this.stockService.editStockItem(this.editedStockData).subscribe(
        Response => {
          this.globalStocksDT.ajax.reload(null, false);
          Swal({
            type: "success",
            title: "Success",
            text: "Item Updated Successfully",
            showConfirmButton: false,
            timer: 1000
          });
        },
        error => {
          Swal({
            type: "error",
            title: error.statusText,
            text: error.message
          });
        }
      );
    } else {
      this.stockService.addStockItem(this.stockForm.value).subscribe(
        Response => {
          this.globalStocksDT.ajax.reload(null, false);
          Swal({
            type: "success",
            title: "Success",
            text: "Item Added Successfully",
            showConfirmButton: false,
            timer: 1000
          });
        },
        error => {
          Swal({
            type: "error",
            title: error.statusText,
            text: error.message
          });
        }
      );
    }

    this.modalReference.close();
  }

  deleteItem() {
    if (StockComponent.selectedRowData["isDamagedFlag"]) {
      swal({
        type: "error",
        title: "vous ne pouvez pas",
        text: "l'article a des factures"
      });
      return;
    }

    swal({
      title: "effacer ?",
      text: "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes!",
      cancelButtonText: "No"
    }).then(result => {
      if (result.value) {
        this.stockService
          .deleteStockItem(StockComponent.selectedStockID)
          .subscribe(
            Response => {
              this.globalStocksDT.ajax.reload(null, false);
              swal({
                type: "success",
                title: "Succès",
                text: "ok",
                showConfirmButton: false,
                timer: 1000
              });
            },
            error => {
              swal({
                type: "error",
                title: "vous ne pouvez pas",
                text: "l'article a des factures"
              });
            }
          );
      }
    });
  }

  openChartModal(chartModal) {
    this.labels = [];
    this.data1 = [];
    this.stockService.itemChart(StockComponent.selectedStockID).subscribe(
      Response => {
        for(let item of Response[0])
        {         
          this.labels.push(item['month']);
          this.data1.push(item['quan']);

        }

        for(let item of Response[1])
        {         
          // this.labels.push(item['month']);
          this.data2.push(item['quan']);

        }

        this.data = {
          labels: this.labels,
          datasets: [
            {
              label: "Facture Client",
              data: this.data1,
              fill: false,
              borderColor: "#4bc0c0"
            },
            {
              label: "Facture Dischargement",
              data: this.data2,
              fill: false,
              borderColor: "#565656"
            }
          ]
        };
      },
      error => {
        Swal({
          type: "error",
          title: error.statusText,
          text: error.message
        });
      }
    );

    this.modalReference = this.modalService.open(chartModal, {
      centered: true,
      size:'lg',
      ariaLabelledBy: "modal-basic-title"
    });

    
  }

  get name() {
    return this.stockForm.get("name");
  }
  get colisage() {
    return this.stockForm.get("colisage");
  }
  get maxPiece() {
    return StockComponent.selectedRowData["piece"];
  }

  get tCRT() {
    return this.transferForm.get("crt").value;
  }

  get tPiece() {
    return this.transferForm.get("piece").value;
  }
  get tcolisage() {
    return this.transferForm.get("colisage").value;
  }
}
