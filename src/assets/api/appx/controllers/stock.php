<?php
require APPPATH . '/libraries/REST_Controller.php';
class stock extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('stock_model');
        $this->load->helper('string');
    }

    public function item_post()
    {
        $name = $this->post('name');
        $code = $this->generateItemCode($name);
        $colisage = $this->post('colisage');
        $result = $this->stock_model->add(array("item_name" => $name, "item_code" => $code, "item_packing_list" => $colisage));
        if ($result === 0) {
            $this->response("Item information could not be added. Try again.", 404);
        } else {
            $this->response("success", 200);
        }

    }

    public function item_put()
    {
        $name = $this->put('name');
        $colisage = $this->put('pck_list');
        $itemID = $this->put('ID');

        $result = $this->stock_model->update($itemID, array("item_name" => $name, "item_packing_list" => $colisage));
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    public function generateItemCode($itemName)
    {
        $itemName = strtoupper($itemName);
        // $itemName=$this->stripAccents($itemName);
        $prefix = substr($itemName, 0, 3);
        $suffix = '0001';
        $repeatedCount = $this->stock_model->getRepeatedCodeCount($prefix);
        $code = $prefix . $suffix;
        for ($i = 0; $i < $repeatedCount; $i++) {
            $code = increment_string($code, '');
        }
        return $code;
    }

    public function transfer_post()
    {
        $itemID = $this->post('itemID');
        $crt = $this->post('crt');
        $piece = $this->post('piece');
        $colisage = $this->post('colisage');
        $itemCode = $this->post('itemCode');
        $itemName = $this->post('itemName');
        date_default_timezone_set("Asia/Beirut");
        $now = date('Y-m-d H:i:s');

        $result = $this->stock_model->addTransferOperation(array("conv_itemID" => $itemID, "conv_date" => $now, "conv_crt" => $crt, "conv_piece" => $piece));
        $result2 = $this->stock_model->updateDamagedStock($itemID, $crt, $piece, $colisage, $itemCode, $itemName);
        if ($result === 0 || $result2 === 0) {
            $this->response("convert information could not be added. Try again.", 404);
        } else {
            $this->response("success", 200);
        }

    }

    public function deleteStockItem_get()
    {
        $itemID = $this->get('ID');
        $result = $this->stock_model->deleteItem($itemID);
        if ($result === false) {
            $this->response("you can not", 404);
        } else {
            $this->response("success", 200);
        }
    }

    public function itemChart_get()
    {
        $itemID = $this->get('itemID');
        $resultFC = $this->stock_model->itemChartFC($itemID);
        $resultFD = $this->stock_model->itemChartFD($itemID);
        if ($resultFC && $resultFD) {
            $response = array();
            $response[0] = $resultFC;
            $response[1] = $resultFD;
            $this->response($response, 200);
            exit;
        }

    }

    // public function stripAccents($stripAccents){
    //     return strtr($stripAccents,'ÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ','AAAAACEEEEIIIINOOOOOUUUUY');
    //   }

}
