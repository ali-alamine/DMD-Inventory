<?php
require APPPATH . '/libraries/REST_Controller.php';
class clients extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('clients_model');
    }

    public function client_post()
    {
        $name = $this->post('name');
        $phone = $this->post('phone');
        $address = $this->post('address');
        $result = $this->clients_model->add(array("per_name" => $name, "per_phone" => $phone, "per_address" => $address));

        if ($result === 0) {
            $this->response("Client information could not be added. Try again.", 404);
        } else {
            $this->response("success", 200);
        }

    }

    public function client_put()
    {
        $client_name = $this->put('name');
        $client_phone = $this->put('phone');
        $client_address = $this->put('address');
        $clientID = $this->put('ID');

        $result = $this->clients_model->update($clientID, array("per_name" => $client_name, "per_phone" => $client_phone, "per_address" => $client_address));
        if ($result === 0) {
            $this->response("client information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    

}
