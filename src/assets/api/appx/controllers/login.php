<?php
require APPPATH . '/libraries/REST_Controller.php';
class login extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('login_model');
    }
    public function getConnection_post()
    {
        $userName = $this->post('userName');
        $password = $this->post('password');
        $result = $this->login_model->getConnection($userName,$password);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

}
