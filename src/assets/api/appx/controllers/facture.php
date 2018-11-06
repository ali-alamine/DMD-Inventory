<?php
require APPPATH . '/libraries/REST_Controller.php';
class facture extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('facture_model');
        $this->load->helper('string');
    }   

    public function newSupplyInvoice_post()
    {
        // $supplyDate = $this->post('supplyDate');
        $invoiceItems = $this->post('items');

        date_default_timezone_set("Africa/Ouagadougou");
        $supplyDate=date("Y-m-d H:i:s");

        // $correctDate = new DateTime($supplyDate);
        // $correctDate->setTimezone(new DateTimeZone('Asia/Beirut'));

        $invoiceCode = $this->generateFactureCode('FD');
        $this->db->trans_begin();

        $invoiceID = $this->facture_model->addSupplyInvoice(array("inv_perID" => 1, "inv_code" => $invoiceCode, "inv_type" => 'FD', 
        "inv_date_req" => $supplyDate));

        foreach ($invoiceItems as $row) {
            
            if($row['crt'] == '') $row['crt']=0;
            if($row['piece'] == '') $row['piece']=0;
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_note" => $row['comment'],
                "ord_invID" => $invoiceID
            );
            $itemID =  $row['itemID'];
            $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];

            $this->facture_model->addItemToInvoice($itemData);
            $this->facture_model->updateStock($itemID,$quantityToAdd,0);
        }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($invoiceCode, 200);
        }
    }

    public function newClientInvoice_post()
    {
        // $invoiceDate = $this->post('invoiceDate');
        $deliveryDate = $this->post('delDate');
        $clientID = $this->post('clientID');

        $invoiceItems = $this->post('items');
        
        // $invoiceCorrectDate = new DateTime($invoiceDate);
        // $invoiceCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));
        date_default_timezone_set("Africa/Ouagadougou");
        $invoiceDate=date("Y-m-d H:i:s");

        $deliveryCorrectDate = new DateTime($deliveryDate);
        $deliveryCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));

        $invoiceCode = $this->generateFactureCode('FC');

        $this->db->trans_begin();

        $invoiceID = $this->facture_model->addClientInvoice(array("inv_perID" =>  $clientID, "inv_code" => $invoiceCode, "inv_type" => 'FC', 
        "inv_date_req" => $invoiceDate, "inv_date_del" => $deliveryCorrectDate->format('Y-m-d')));

        foreach ($invoiceItems as $row) {
            if($row['crt'] == '') $row['crt']=0;
            if($row['piece'] == '') $row['piece']=0;
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_item_isDamaged" => $row['isDamaged'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_note" => $row['comment'],
                "ord_invID" => $invoiceID
            );

            $itemID =  $row['itemID'];
            $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];
            $isDamaged =  $row['isDamaged'];

            $this->facture_model->addItemToInvoice($itemData);
            $this->facture_model->updateStock($itemID,-$quantityToAdd,$isDamaged);
        }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($invoiceCode, 200);
        }
    }

    public function searchClient_get(){
        $keyword = $this->get('keyword');
        $result = $this->facture_model->searchForClient($keyword);      
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function getFactureDetails_get(){
        $factureID = $this->get('factureID');
        $result1 = $this->facture_model->getFactureDetails($factureID);
        $result2 = $this->facture_model->getOrderInvoiceDetails($factureID);
        $response = array();
        // if($result1)
            $response[0] = $result1;
        // if ($result2) {
            $response[1] = $result2;
        if($response){
            $this->response($response, 200);
            exit;
        } 
        // else {
        //     $this->response(0, 200);
        //     exit;
        // }
    }

    public function generateFactureCode($factureType){
        $factureType=strtoupper($factureType);        
        $repeatedCount = $this->facture_model->getRepeatedCodeCount($factureType);
        $suffix = $repeatedCount+1;
        $suffix = str_pad($suffix, 5, '0', STR_PAD_LEFT);
        $code=$factureType.$suffix;
        
        return $code;
    }

    public function editSupplyInvoice_post()
    {
        $supplyDate = $this->post('supplyDate');
        $invoiceID = $this->post('invoiceID');
        $invoiceItems = $this->post('items');

        // $correctDate = new DateTime($supplyDate);
        // $correctDate->setTimezone(new DateTimeZone('Asia/Beirut'));

       
        $this->db->trans_begin();

        // $this->facture_model->updateSupplyInvoice( $invoiceID , array("inv_date_req" => $correctDate->format('Y-m-d H:i:s')));


        $oldInvoiceOrder = $this->facture_model->getOrderInvoiceDetails($invoiceID);

        foreach ($oldInvoiceOrder as $row) {
            $itemID =  $row['ord_itemID'];
            $quantity = ($row['item_packing_list'] * $row['ord_crt']) + $row['ord_piece'];            
            $this->facture_model->updateStock($itemID,-$quantity,0);
        }

        $this->facture_model->deleteOldOrderInvoice($invoiceID);

        foreach ($invoiceItems as $row) {
            if($row['crt'] == '') $row['crt']=0;
            if($row['piece'] == '') $row['piece']=0;
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_note" => $row['comment'],
                "ord_invID" => $invoiceID
            );
            $itemID =  $row['itemID'];
            $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];

            $this->facture_model->addItemToInvoice($itemData);
            $this->facture_model->updateStock($itemID,$quantityToAdd,0);
        }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }
    public function editClientInvoice_post(){
        $delDate = $this->post('delDate');
        $invID = $this->post('invID');
        $clientID = $this->post('clientID');
        $invoiceItemsEdit = $this->post('itemsEdit');
        $invoiceItems = $this->post('items');
        $correctDate = new DateTime($delDate);
        $correctDate->setTimezone(new DateTimeZone('Asia/Beirut'));
        $this->db->trans_begin();

        $this->facture_model->editReturnInvoice($invID,array("inv_perID" =>  $clientID, 
        "inv_date_del" => $correctDate->format('Y-m-d')));

        foreach ($invoiceItemsEdit as $row) {

            $query = $this->db->query("SELECT ord_crt,ord_piece FROM order_inv 
            where ordID = '".$row['ordID']."'");

            if ($query->num_rows() > 0) {     
                $result = $query->result_array();
                foreach ($result as $rowQuantity) {
                    $crt = $rowQuantity['ord_crt'];
                    $piece = $rowQuantity['ord_piece'];
                }
            }
            if($crt != $row['crt'] || $piece != $row['piece'] || $row['isDeleted'] == "1"){
                
                if($row['crt'] == '') $row['crt']=0;
                if($row['piece'] == '') $row['piece']=0;
                
                $quantityToAdd = ($row['colisage'] * $crt) + $piece;
                $this->facture_model->updateStock($row['itemID'],+$quantityToAdd,$row['isDamaged']);
                if($row['isDeleted'] == "0"){
                    $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];
                    $this->facture_model->updateStock($row['itemID'],-$quantityToAdd,$row['isDamaged']);
                    $itemData = array(
                        "ord_piece" => $row['piece'],
                        "ord_crt" => $row['crt'],
                        "ord_note" => $row['comment']
                    );
                    $this->facture_model->editItemToInvoice($row['ordID'],$itemData);
                }
            }
            if($row['isDeleted'] == "1"){
                $this->facture_model->deletedOrder($row['ordID']);
            }            
        }
        if($invoiceItems != ''){
            // $this->facture_model->updateInvoice($invID,-1);
            foreach ($invoiceItems as $row) {
                if($row['crt'] == '') $row['crt']=0;
                if($row['piece'] == '') $row['piece']=0;
                $itemData = array(
                    "ord_itemID" => $row['itemID'],
                    "ord_item_isDamaged" => $row['isDamaged'],
                    "ord_piece" => $row['piece'],
                    "ord_crt" => $row['crt'],
                    "ord_note" => $row['comment'],
                    "ord_invID" => $invID
                );
    
                $ordID = $this->facture_model->addItemToInvoice($itemData);
                
                $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];
                $this->facture_model->updateStock($row['itemID'],$quantityToAdd,$row['isDamaged']);
            }
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
