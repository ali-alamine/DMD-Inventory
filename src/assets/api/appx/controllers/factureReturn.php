<?php
require APPPATH . '/libraries/REST_Controller.php';
class factureReturn extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('factureReturn_model');
        $this->load->helper('string');
    }   
    public function generateFactureCode($factureType){
        $factureType=strtoupper($factureType);        
        $repeatedCount = $this->factureReturn_model->getRepeatedCodeCount($factureType);
        $suffix = $repeatedCount+1;
        $suffix = str_pad($suffix, 5, '0', STR_PAD_LEFT);
        $code=$factureType.$suffix;
        
        return $code;
    }
    
    public function searchPerson_get(){
        $name = $this->get('keyword');
        $isClient = $this->get('isClient');
        $result = $this->factureReturn_model->searchPerson($name,$isClient);      
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }
    public function newReturnInvoice_post(){
        // $invoiceDate = $this->post('invoiceDate');
        $clientID = $this->post('clientID');
        $clientPhone = $this->post('clientPhone');
        $clientAddress = $this->post('clientAddress');
        $invoiceItems = $this->post('items');
        
        date_default_timezone_set("Africa/Ouagadougou");
        $invoiceDate=date("Y-m-d H:i:s");

        // $invoiceCorrectDate = new DateTime($invoiceDate);
        // $invoiceCorrectDate->setTimezone(new DateTimeZone('Asia/Beirut'));
        $invoiceCode = $this->generateFactureCode('FR');
        $this->db->trans_begin();
        $invoiceID = $this->factureReturn_model->addReturnInvoice(array("inv_perID" =>  $clientID, "inv_code" => $invoiceCode, 
        "inv_type" => 'FR', "inv_date_req" => $invoiceDate, "inv_status" => -1,
        "inv_per_phone" => $clientPhone,"inv_per_address" => $clientAddress));
        foreach ($invoiceItems as $row) {
            $itemData = array(
                "ord_itemID" => $row['itemID'],
                "ord_item_isDamaged" => $row['isDamaged'],
                "ord_piece" => $row['piece'],
                "ord_crt" => $row['crt'],
                "ord_invID" => $invoiceID
            );
            $ordID = $this->factureReturn_model->addItemToInvoice($itemData);
            if ($ordID === 0) {
                $this->response("Item information could not be saved. Try again.", 404);
            } else {
                date_default_timezone_set("Africa/Ouagadougou");
                $date=date("Y-m-d H:i:s");
                $this->factureReturn_model->addDateReturn(array('date_ordID' => $ordID,'ord_perID' => $clientID,
                'ord_date_req' => $date));
            }
        }
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($invoiceCode);
        }
    }
    public function getOrderNoConfirm_get(){
        $result = $this->factureReturn_model->getOrderNoConfirm();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
    // public function getFactureDetails_get(){
    //     $invID = $this->get('invID');
    //     $result = $this->factureReturn_model->getFactureDetails($invID);      
    //     if ($result) {
    //         $this->response($result, 200);
    //         exit;
    //     }
    // }
    public function getFactureDetails_get(){
        $invID = $this->get('invID');
        $result1 = $this->factureReturn_model->getFactureDetails($invID);
        $result2 = $this->factureReturn_model->getOrderInvoiceDetails($invID);
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
    public function editReturnInvoice_post(){
        $invoiceDate = $this->post('invoiceDate');
        $invID = $this->post('invID');
        $clientID = $this->post('clientID');
        $clientPhone = $this->post('clientPhone');
        $clientAddress = $this->post('clientAddress');
        $invoiceItemsEdit = $this->post('itemsEdit');
        $invoiceItems = $this->post('items');
        $this->db->trans_begin();

        $this->factureReturn_model->editReturnInvoice($invID,array("inv_perID" =>  $clientID,
        "inv_per_phone" => $clientPhone,"inv_per_address" => $clientAddress));
        foreach ($invoiceItemsEdit as $row) {
            $query = $this->db->query("SELECT ord_crt,ord_piece,ord_perID FROM order_inv 
            INNER JOIN return_details on date_ordID = ordID where ordID = '".$row['ordID']."'");
            if ($query->num_rows() > 0) {     
                $result = $query->result_array();
                foreach ($result as $rowQuantity) {
                    $crt = $rowQuantity['ord_crt'];
                    $piece = $rowQuantity['ord_piece'];
                    // $isDamaged = $rowQuantity['ord_item_isDamaged'];
                    $ord_perID = $rowQuantity['ord_perID'];
                }
            }
            if($crt != $row['crt'] || $piece != $row['piece'] || $row['isDeleted'] == "1"){
                $quantityToAdd = ($row['colisage'] * $crt) + $piece;
                $this->factureReturn_model->updateStock($row['itemID'],-$quantityToAdd,$row['isDamaged']);
                if($row['isDeleted'] == "0"){
                    $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];
                    $this->factureReturn_model->updateStock($row['itemID'],$quantityToAdd,$row['isDamaged']);
                    $itemData = array(
                        "ord_piece" => $row['piece'],
                        "ord_crt" => $row['crt']
                    );
                    $this->factureReturn_model->editItemToInvoice($row['ordID'],$itemData);
                }
            }
            if($ord_perID != $clientID)
                $this->factureReturn_model->editDateReturn($row['ordID'],array('ord_perID' => $clientID));
            if($row['isDeleted'] == "1"){
                $this->factureReturn_model->deletedOrder($row['ordID']);
            }            
        }
        if(sizeof($invoiceItems) > 0){
            $this->factureReturn_model->updateInvoice($invID,-1);
            foreach ($invoiceItems as $row) {
                if($row['crt'] == '') $row['crt']=0;
                if($row['piece'] == '') $row['piece']=0;
                $itemData = array(
                    "ord_itemID" => $row['itemID'],
                    "ord_item_isDamaged" => $row['isDamaged'],
                    "ord_piece" => $row['piece'],
                    "ord_crt" => $row['crt'],
                    "ord_invID" => $invID
                );
    
                $ordID = $this->factureReturn_model->addItemToInvoice($itemData);
                if ($ordID === 0) {
                    $this->response("Item information could not be saved. Try again.", 404);
                } else {
                    date_default_timezone_set("Africa/Ouagadougou");
                    $date=date("Y-m-d H:i:s");
                    $this->factureReturn_model->addDateReturn(array('date_ordID' => $ordID,'ord_perID' => $clientID,
                    'ord_date_req' => $date,'ord_date_com' =>$date,'ord_status'=> 0));
                }
                $quantityToAdd = ($row['colisage'] * $row['crt']) + $row['piece'];
                $this->factureReturn_model->updateStock($row['itemID'],$quantityToAdd,$row['isDamaged']);
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
