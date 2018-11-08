<?php
require APPPATH . '/libraries/REST_Controller.php';
class clients extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('clients_model');
        $this->load->helper('string');
    }

    public function client_post()
    {
        $name = $this->post('name');
        $phone = $this->post('phone');
        $address = $this->post('address');
        $code = $this->generateClientCode($name);

        $result = $this->clients_model->add(array("per_name" => $name, "per_phone" => $phone, "per_address" => $address,"per_code" => $code));

        if ($result === 0) {
            $this->response("Client information could not be added. Try again.", 404);
        } else {
            $this->response($result, 200);
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


    public function generateClientCode($clientName){
        $clientName=strtoupper($clientName);
        $prefix = substr($clientName,0,3);
        $repeatedCount = $this->clients_model->getRepeatedCodeCount($prefix);    
        $suffix = $repeatedCount+1;
        $suffix = str_pad($suffix, 4, '0', STR_PAD_LEFT);
        $code=$prefix.$suffix;
        return $code;
        // $clientName=$this->stripAccents($clientName);       
        // $suffix='0001';
        // $code=$prefix.$suffix;
        // for($i=0;$i<$repeatedCount;$i++){
        //     $code=increment_string($code,'');
        // }         
        // return $code;
    }
    
    public function searchClientName_get(){

        $keyword = $this->get('keyword');

        
        $result = $this->clients_model->searchClientName($keyword);      
        if ($result) {
            $this->response($result, 200);

            exit;
        }
    }
    
    public function getAllClient_get(){                
        $result = $this->clients_model->getAllClients();      
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }

    public function deleteClient_get()
    {
        $clientID = $this->get('ID');
        $result = $this->clients_model->deleteClient($clientID);
        if ($result === false) {
            $this->response("you can not", 404);
        } else {
            $this->response("success", 200);
        }
    }
}
