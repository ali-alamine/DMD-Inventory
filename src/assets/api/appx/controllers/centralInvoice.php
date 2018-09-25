<?php
require APPPATH . '/libraries/REST_Controller.php';
class centralInvoice extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('centralInvoice_model');
    }

    public function client_put()
    {
        $client_name = $this->put('name');
        $client_phone = $this->put('phone');
        $client_address = $this->put('address');
        $clientID = $this->put('id');

        $result = $this->centralInvoice_model->update($clientID, array("name" => $client_name, "phone" => $client_phone, "address" => $client_address));
        if ($result === 0) {
            $this->response("client information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    public function deleteInvoice_put()
    {
        
        $invoiceID = $this->put('ID');
        $invoiceAmount = $this->put('price');

        $result = $this->centralInvoice_model->deleteInvoice($invoiceID,$invoiceAmount);
        if ($result === 0) {
            $this->response("invoice information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

      
    
}
