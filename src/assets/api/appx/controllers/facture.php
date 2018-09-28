<?php
require APPPATH . '/libraries/REST_Controller.php';
class facture extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('facture_model');
    }

    public function newSupplyInvoice_post()
    {
        $supplyDate = $this->post('supplyDate');
        $invoiceItems = $this->post('items');

        $correctDate = new DateTime($supplyDate);
        $correctDate->setTimezone(new DateTimeZone('Asia/Beirut'));

        $this->db->trans_begin();

        $invoiceID = $this->facture_model->addSupplyInvoice(array("inv_perID" => 1, "inv_code" => 12, "inv_type" => 'FD', "inv_date_req" => $correctDate->format('Y-m-d H:i:s'), "inv_status" => 1));

        foreach ($invoiceItems as $row) {
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_note" => $row['comment'],
                "ord_invID" => $invoiceID
            );

            $this->facture_model->addItemToInvoice($itemData);
        }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }

}
