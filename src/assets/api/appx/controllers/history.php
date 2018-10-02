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
}
