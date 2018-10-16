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
    public function getUser_get()
    {
        $result = $this->login_model->getUser();
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
    public function editUser_put(){
        $userID = $this->put('userID');
        $userName = $this->put('userName');
        $password = $this->put('password');

        $result = $this->login_model->update($userID, array("user_name" => $userName, "user_password" => $password));
        if ($result === 0) {
            $this->response("user information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }

    }

}
