<?php
require APPPATH . '/libraries/REST_Controller.php';
class history extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('history_model');
    }

    public function getFactureDetails_get(){
        $ID = $this->get('ID');
        $type = $this->get('type');
        $result = $this->history_model->getFactureDetails($ID,$type);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
    public function deleteFacture_get()
    {
        $ID = $this->get('ID');
        $type = $this->get('type');
        $selectItem = $this->history_model->getFactureDetails($ID,$type);
        if($selectItem == 0 ){
            $result = $this->history_model->deleteFacture($ID);
            if ($result) {
                $this->response($result, 200);
                exit;
            }
        }else{
            $this->response('0', 200);
        }
    }
    public function deleteItem_get()
    {
        $ID = $this->get('ID');
        // echo $ID;
        $result = $this->history_model->deleteItem($ID);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    } 
    public function getFactureReturnDetails_get(){
        $ID = $this->get('ID');
        $result = $this->history_model->getFactureReturnDetails($ID);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }  
    public function confirmOrder_post(){       
        $ordID = $this->post('ordID');
        $invID = $this->post('invID');
        $crt = $this->post('crt');
        $piece = $this->post('piece');
        $itemID = $this->post('itemID');
        $isDamaged = $this->post('isDamaged');
        $packingList = $this->post('packingList');
        date_default_timezone_set("Asia/Beirut");
        $date_com=date("Y-m-d H:i:s");
        $this->db->trans_begin();
        $this->history_model->updateOrder($ordID,1,$date_com);
        $quantityToAdd = ($packingList * $crt) + $piece;
        $this->history_model->updateStock($itemID,+$quantityToAdd,$isDamaged);
        $count = $this->history_model->checkInvoice($invID);
        // echo $count;
        if($count == 0)
            $this->history_model->updateInvoice($invID,0);
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($count, 200);
        }
    }
    public function rejectOrder_get(){
        $ordID = $this->get('ordID');
        $this->db->trans_begin();
        $this->history_model->deletedOrder($ordID);
        if($count == 0)
            $this->history_model->updateInvoice($invID,0);
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($count, 200);
        }
    } 
    public function getOrderNoConfirm_get()
    {
        $result = $this->history_model->getOrderNoConfirm();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
}
