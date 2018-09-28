<?php
class history_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    public function getFactureDetails($ID)
    {
        $query = $this->db->query("SELECT * FROM order_inv INNER JOIN item ON itemID = ord_itemID
         where ord_invID = '".$ID."' and ord_isDeleted = '0' ");
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    public function deleteFacture($ID)
    {
        $this->db->set('inv_status', -1);
        $this->db->where('invID', $ID);        
        if ($this->db->update('invoice')) {
            return true;
        } else {
            return false;
        }
    }
    public function deleteItem($ID)
    {
        $this->db->set('ord_isDeleted', 1);
        $this->db->where('ordID', $ID);        
        if ($this->db->update('order_inv')) {
            return true;
        } else {
            return false;
        }
    }
    // public function getInternetDrawer()
    // {
    //     $query = $this->db->query("select *,(drawer.amount +  IFNULL(d.sumProfile,0) - IFNULL(d2.supplySum,0) - IFNULL(d3.sumWithdraw,0)  +   IFNULL(d4.sumAdded,0) +  IFNULL( d5.sumReturned,0) ) as total from drawer 
    //     left join (select coalesce(sum(profile),0) as sumProfile ,date(payment_date) as paymentDate FROM subscriber_detail WHERE is_paid = 1 GROUP by date(payment_date) having paymentDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d on drawer.date = d.paymentDate
        
    //     left join (select  sum(amount) as supplySum, date(payment_date) as sPaymentDate FROM payment where drawer_type = 'S' group by date(payment_date) having sPaymentDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d2 on  drawer.date = d2.sPaymentDate 
        
    //     left join (select coalesce(sum(amount),0) as sumWithdraw ,date(date) as widthdrawDate FROM operation WHERE dra_type = 'S' and op_type='w' GROUP by date(date) having widthdrawDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d3 on drawer.date = d3.widthdrawDate
        
    //     left join (select coalesce(sum(amount),0) as sumAdded ,date(date) as addedDate FROM operation WHERE dra_type = 'S' and op_type='a' GROUP by date(date) having addedDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d4 on drawer.date = d4.addedDate
        
    //     left join (select coalesce(sum(amount),0) as sumReturned ,date(date) as returnedDate FROM operation WHERE dra_type = 'S' and op_type='r' GROUP by date(date) having returnedDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d5 on drawer.date = d5.returnedDate
        
    //     where drawer.type = 's' and  drawer.date between ( NOW() - INTERVAL 1 MONTH ) and NOW()  ");

    //     if ($query->num_rows() > 0) {
    //         return $query->result_array();
    //     } else {
    //         return 0;
    //     }

    // }

    // public function setDrawer($data)
    // {
    //     date_default_timezone_set('Asia/Beirut');
    //     $today = date('Y-m-d');
        
    //     $this->db->select('*');
    //     $this->db->from('drawer');
    //     $this->db->where('date', $today);
    //     $query = $this->db->get();

    //     if ($query->num_rows() == 0) {            
    //         $this->db->insert_batch('drawer', $data);
    //         return true;
    //     } else {
    //         return 0;
    //     }

    // }
    // public function getAccDrawer()
    // {
    //     $query = $this->db->query("select *,(drawer.amount +  IFNULL(d.sumPrice,0) +  IFNULL(d1.sumPrice1,0) - IFNULL(d2.supplySum,0) - IFNULL(d3.sumWithdraw,0)  +   IFNULL(d4.sumAdded,0) +  IFNULL( d5.sumReturned,0) ) as total,(IFNULL(d.sumPrice,0) +  IFNULL(d1.sumPrice1,0)) as sumPrice from drawer 
    //     left join (select coalesce(sum(price),0) as sumPrice ,date(date) as paymentDate,sum(profit) as sumProfit FROM invoice WHERE is_debit = 0 and type='AC' GROUP by date(date) having paymentDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d on drawer.date = d.paymentDate
        
    //     left join (select coalesce(sum(price),0) as sumPrice1 ,date(date) as paymentDate FROM invoice_central  GROUP by date(date) having paymentDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d1 on drawer.date = d1.paymentDate
        
    //     left join (select  sum(amount) as supplySum, date(payment_date) as sPaymentDate FROM payment where drawer_type = 'a' group by date(payment_date) having sPaymentDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d2 on  drawer.date = d2.sPaymentDate 
        
    //     left join (select coalesce(sum(amount),0) as sumWithdraw ,date(date) as widthdrawDate  FROM operation WHERE dra_type = 'a' and op_type='w' GROUP by date(date) having widthdrawDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d3 on drawer.date = d3.widthdrawDate
        
    //     left join (select coalesce(sum(amount),0) as sumAdded ,date(date) as addedDate  FROM operation WHERE dra_type = 'a' and op_type='a' GROUP by date(date) having addedDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d4 on drawer.date = d4.addedDate
        
    //     left join (select coalesce(sum(amount),0) as sumReturned ,date(date) as returnedDate  FROM operation WHERE dra_type = 'a' and op_type='r' GROUP by date(date) having returnedDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d5 on drawer.date = d5.returnedDate
        
    //     where drawer.type = 'a'  and  drawer.date between ( NOW() - INTERVAL 1 MONTH ) and NOW()  ");

    //     if ($query->num_rows() > 0) {
    //         return $query->result_array();
    //     } else {
    //         return 0;
    //     }

    // }
    // public function getMobileDrawer()
    // {
    //     $query = $this->db->query("select *,(drawer.amount +  IFNULL(d.sumPrice,0)  - IFNULL(d2.supplySum,0) - IFNULL(d3.sumWithdraw,0)  +   IFNULL(d4.sumAdded,0) +  IFNULL( d5.sumReturned,0) ) as total from drawer 
    //     left join (select coalesce(sum(price),0) as sumPrice ,date(date) as paymentDate,sum(profit) as sumProfit FROM invoice WHERE is_debit = 0 and ( type='RC' OR type='OF' OR type='CT' ) GROUP by date(date) having paymentDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d on drawer.date = d.paymentDate
        
    //     left join (select  sum(amount) as supplySum, date(payment_date) as paymentDate from payment where drawer_type = 'm' group by date(payment_date) having paymentDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d2 on  drawer.date = d2.paymentDate 
        
    //     left join (select coalesce(sum(amount),0) as sumWithdraw ,date(date) as widthdrawDate  FROM operation WHERE dra_type = 'm' and op_type='w' GROUP by date(date) having widthdrawDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d3 on drawer.date = d3.widthdrawDate
        
    //     left join (select coalesce(sum(amount),0) as sumAdded ,date(date) as addedDate  FROM operation WHERE dra_type = 'm' and op_type='a' GROUP by date(date) having addedDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d4 on drawer.date = d4.addedDate
        
    //     left join (select coalesce(sum(amount),0) as sumReturned ,date(date) as returnedDate  FROM operation WHERE dra_type = 'm' and op_type='r' GROUP by date(date) having returnedDate between ( NOW() - INTERVAL 1 MONTH ) and NOW() ) as d5 on drawer.date = d5.returnedDate
        
    //     where drawer.type = 'm'  and  drawer.date between ( NOW() - INTERVAL 1 MONTH ) and NOW() ");

    //     if ($query->num_rows() > 0) {
    //         return $query->result_array();
    //     } else {
    //         return 0;
    //     }

    // }
    // public function add($table,$data){
    //     if ($this->db->insert($table, $data)) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    
}
