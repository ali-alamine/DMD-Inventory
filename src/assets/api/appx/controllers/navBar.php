<?php
require APPPATH . '/libraries/REST_Controller.php';
class navBar extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('navBar_model');
    }
    public static function getCountFR_get(){
        $count = $this->navBar_model->getCountFR();
        if ($count) {
            $this->response($count, 200);
            exit;
        }
    }
}
