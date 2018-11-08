
<?php
class navBar_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    public function getCountFR(){
        $query = $this->db->query("SELECT count(invID) as c FROM invoice
        -- INNER JOIN order_inv on ordID=date_ordID INNER JOIN return_details on ordID = date_ordID
        where inv_status = '-1' ");
        if ($query->num_rows() > 0) {
            return  $query->result_array();
        } else {
            return 0;
        }
    }
}