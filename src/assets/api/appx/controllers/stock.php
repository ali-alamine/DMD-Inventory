<?php
require APPPATH . '/libraries/REST_Controller.php';
class stock extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('stock_model');
    }
    public function stockAcc_post(){
        $name = $this->post('name');
        // $cost = $this->post('cost');
        $price = $this->post('price');
        // $quantity = $this->post('quantity');
        $bar_code = $this->post('bar_code');
        $type = "AC";
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        $IID = $this->stock_model->add('item',array("name" => $name, "price_item" => $price,
        "bar_code" => $bar_code,"type" => $type));
        if ($IID === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            // $result = $this->stock_model->add('accessories',array("IID" => $IID,"cost" => $cost, "price" => $price,
            // "quantity" => $quantity));
            $result = $this->stock_model->add('accessories',array("IID" => $IID, "price" => $price,));
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    } 
    public function stockMRC_post(){
        $name = $this->post('name');
        // $quantity = $this->post('quantity');
        // $cost = $this->post('cost');
        $price = $this->post('price');
        $bar_code = $this->post('bar_code');
        $company = $this->post('company');
        $type = "RC";
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        $IID = $this->stock_model->add('item',array("name" => $name, "price_item" => $price,
        "bar_code" => $bar_code,"type" => $type));
        if ($IID === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            // $result = $this->stock_model->add('recharge_card',array("IID" => $IID,"company" => $company,"cost" => $cost, "price" => $price,
            // "quantity" => $quantity));
            $result = $this->stock_model->add('recharge_card',array("IID" => $IID,"company" => $company, "price" => $price));
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    } 
    public function stockOF_post(){
        $name = $this->post('name');
        $num_of_mounth = $this->post('num_of_mounth');
        $num_of_credit = $this->post('num_of_credit');
        $price = $this->post('price');
        $bar_code = $this->post('bar_code');
        $company = $this->post('company');
        $type = "OF";
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        $IID = $this->stock_model->add('item',array("name" => $name, "price_item" => $price,
        "bar_code" => $bar_code,"type" => $type));
        if ($IID === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $result = $this->stock_model->add('offers',array("IID" => $IID,"company" => $company,"num_of_mounth" => $num_of_mounth,"num_of_credit" => $num_of_credit, "price" => $price));
        }
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function stockAcc_put(){
        $name = $this->put('name');
        // $quantity = $this->put('quantity');
        // $cost = $this->put('cost');
        $price = $this->put('price');
        $bar_code = $this->put('bar_code');
        $IID = $this->put('IID');
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        $resultAcc = $this->stock_model->update('accessories',$IID, array( "price" => $price));
        // $resultAcc = $this->stock_model->update('accessories',$IID, array( "cost" => $cost,"price" => $price,
        // "quantity" => $quantity));
        $resultItem = $this->stock_model->update('item',$IID, array("name" => $name, "bar_code" => $bar_code, "price_item" => $price));
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }
    public function stockMRC_put(){
        // $is_offers = $this->put('is_offers');
        $name = $this->put('name');
        // $cost = $this->put('cost');
        $price = $this->put('price');
        // $quantity = $this->put('quantity');
        $bar_code = $this->put('bar_code');
        $IID = $this->put('IID');
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        $resultRC = $this->stock_model->update('recharge_card',$IID, array("price" => $price));
        // $resultRC = $this->stock_model->update('recharge_card',$IID, array( "cost" => $cost,"price" => $price,
        // "quantity" => $quantity));
        $resultItem = $this->stock_model->update('item',$IID, array("name" => $name, "bar_code" => $bar_code, "price_item" => $price));
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }
    public function stockOF_put(){
        $name = $this->put('name');
        $num_of_mounth = $this->put('num_of_mounth');
        $num_of_credit = $this->put('num_of_credit');
        $price = $this->put('price');
        $bar_code = $this->put('bar_code');
        $IID = $this->put('IID');
        $this->db->trans_start();
        $this->db->trans_strict(FALSE);
        $resultRC = $this->stock_model->update('offers',$IID, array( "num_of_mounth" => $num_of_mounth,"num_of_credit" => $num_of_credit,"price" => $price));
        $resultItem = $this->stock_model->update('item',$IID, array("name" => $name, "bar_code" => $bar_code, "price_item" => $price));
        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } 
        else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }
    public function stockCT_put(){
        $credits = $this->put('credits');
        $IID = $this->put('IID');
        $result = $this->stock_model->update('credit',$IID, array( "credits" => $credits));
        if ($result === 0) {
            $this->response("update Credits information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }
    // public function deleteItem_put(){
    //     $id = $this->put('ID');
    //     $type = $this->put('type');
    //     if (!$id) {
    //         $this->response("Parameter missing", 404);
    //     }
    //     if($type=="AC"){
    //         if ($this->stock_model->delete('accessories',$id))
    //             $this->response("Success", 200);
    //     } else
    //     if($type=="RC"){

    //     } else
    //     if($type=="CT"){

    //     } else
    //     if($type=="OF"){

    //     }else {
    //         $this->response("Cannot Delete this item, try to delete its items", 400);
    //     }
    // }
    public function searchItem_get(){
        $searchInput = $this->get('searchInput');
        $result = $this->stock_model->searchItem($searchInput);
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }    
}
