<?php
include './connection.php';
openConn();
$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";
$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "(SELECT COUNT(ordID) as exp FROM order_inv  INNER JOIN invoice on invID = ord_invID 
    INNER JOIN person on perID = inv_perID  
    INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged  
    where  ord_isDeleted = '0' and inv_type != 'FR')
 UNION
 (SELECT COUNT(ordID) as exp FROM order_inv INNER JOIN invoice on invID = ord_invID 
    INNER JOIN person on perID = inv_perID  
    INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged 
    INNER JOIN return_details on ordID = date_ordID 
    where ord_isDeleted = '0' and ord_status = 1)"))['exp'];

$condition = "WHERE 1 ";

if (isset($_GET['clientSearch']) && $_GET['clientSearch'] != "") {
    $clientSearch = $_GET['clientSearch'];
    $condition = $condition . " AND per_name LIKE '%" . $clientSearch."%' ";

}
if (isset($_GET['articleSearch']) && $_GET['articleSearch'] != "") {
    $articleSearch = $_GET['articleSearch'];
    $condition = $condition . " AND inv_type LIKE '%" . $articleSearch."%' ";

}
if (isset($_GET['crtSearch']) && $_GET['crtSearch'] != "") {
    $crtSearch = $_GET['crtSearch'];
    $condition = $condition . " AND ord_crt LIKE '%" . $crtSearch."%' ";

}
if (isset($_GET['pieceSearch']) && $_GET['pieceSearch'] != "") {
    $pieceSearch = $_GET['pieceSearch'];
    $condition = $condition . " AND ord_piece LIKE '%" . $pieceSearch."%' ";

}
if (isset($_GET['typeSearch']) && $_GET['typeSearch'] != "") {
    $typeSearch = $_GET['typeSearch'];
    $condition = $condition . " AND item_name LIKE '%" . $typeSearch."%' ";

}
if (isset($_GET['codeSearch']) && $_GET['codeSearch'] != "") {
    $codeSearch = $_GET['codeSearch'];
    $condition = $condition . " AND inv_code LIKE '%" . $codeSearch."%' ";

}

if (isset($_GET['dateSearch']) && $_GET['dateSearch'] != "") {
    $dateSearch = $_GET['dateSearch'];
    if (substr_count($dateSearch, "-") == 1 )   {
        $date_array = explode("-",$dateSearch); // split the array
        $var_day = $date_array[0]; //day seqment
        $var_month = $date_array[1]; //month segment
        // $var_year = $date_array[2]; //year segment
        $dateSearch = $var_month.'-'.$var_day; // join them together
    } 
    if(substr_count($dateSearch, "-") == 2 )   {
        $date_array = explode("-",$dateSearch); // split the array
        $var_day = $date_array[0]; //day seqment
        $var_month = $date_array[1]; //month segment
        $var_year = $date_array[2]; //year segment
        $dateSearch = $var_year.'-'.$var_month.'-'.$var_day; // join them together
    }
    $condition = $condition . " AND DATE_FORMAT(inv_date_req,'%Y-%m-%d %H:%i') LIKE '%" . $dateSearch."%' ";

}


if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if ($orderBy == 'inv_date_req') {
        $orderBy = 'DATE_FORMAT(inv_date_req,"%Y-%m-%d %H:%i")';
    }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}

// if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
//     $search = $_GET["search"]["value"];

//     if (substr_count($search, "-") == 1 )   {
//         $date_array = explode("-",$search); // split the array
//         $var_day = $date_array[0]; //day seqment
//         $var_month = $date_array[1]; //month segment
//         // $var_year = $date_array[2]; //year segment
//         $search = $var_month.'-'.$var_day; // join them together
//     } 
//     if(substr_count($search, "-") == 2 )   {
//         $date_array = explode("-",$search); // split the array
//         $var_day = $date_array[0]; //day seqment
//         $var_month = $date_array[1]; //month segment
//         $var_year = $date_array[2]; //year segment
//         $search = $var_year.'-'.$var_month.'-'.$var_day; // join them together
//     }
    

//     if($show=="facture")
//         $getAllFactureQuery = "select *,DATE_FORMAT(inv_date_req,'%d-%m-%Y %H:%i') AS inv_date_req  from invoice INNER JOIN person on perID= inv_perID  where (inv_date_req like '%" . $search . "%' OR per_name like '%" . $search . "%' OR inv_code like '%" . $search . "%' ) and inv_status = '1' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
//     if($show=="items")
//         $getAllFactureQuery = "(select ordID,invID,ord_crt,ord_piece,item_name,per_name,per_phone,per_address,inv_code,inv_type,DATE_FORMAT(inv_date_del,'%d-%m-%Y %H:%i') AS inv_date_del,DATE_FORMAT(inv_date_req,'%d-%m-%Y %H:%i') AS inv_date_req from order_inv  
//         INNER JOIN invoice on invID = ord_invID 
//         INNER JOIN person on perID = inv_perID  
//         INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged  
//         where (inv_date_req like '%" . $search . "%' OR per_name like '%" . $search . "%' OR inv_code like '%" . $search . "%' OR inv_type like '%" . $search . "%' OR item_name like '%" . $search . "%') 
//         and ord_isDeleted = '0' and inv_type != 'FR')
//         UNION
//         (select ordID,invID,ord_crt,ord_piece,item_name,per_name,per_phone,per_address,inv_code,inv_type,DATE_FORMAT(inv_date_del,'%d-%m-%Y %H:%i') AS inv_date_del,DATE_FORMAT(inv_date_req,'%d-%m-%Y %H:%i') AS inv_date_req from order_inv  
//         INNER JOIN invoice on invID = ord_invID 
//         INNER JOIN person on perID = inv_perID  
//         INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged 
//         INNER JOIN return_details on ordID = date_ordID 
//         where (inv_date_req like '%" . $search . "%' OR per_name like '%" . $search . "%' OR inv_code like '%" . $search . "%' OR inv_type like '%" . $search . "%' OR item_name like '%" . $search . "%')
//         and ord_isDeleted = '0' and inv_type = 'FR' and ord_status = 1) 
//         " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
//     if($show=="return")
//         $getAllFactureQuery = "select *,DATE_FORMAT(inv_date_req,'%d-%m-%Y %H:%i') AS inv_date_req from invoice INNER JOIN person on perID= inv_perID where (inv_date_req like '%" . $search . "%' OR per_name like '%" . $search . "%' OR inv_code like '%" . $search . "%' ) and inv_type = 'FR' and inv_status='-1' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
     
// } else {
    // if($show=="facture")
    //     $getAllFactureQuery = "select *,DATE_FORMAT(inv_date_req,'%d-%m-%Y %H:%i') AS inv_date_req from invoice INNER JOIN person on perID= inv_perID " . $condition . " and inv_status = '1'  " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    // if($show=="items")
$getAllFactureQuery = "(select ordID,invID,ord_crt,ord_piece,item_name,per_name,per_phone,per_address,inv_code,inv_type,DATE_FORMAT(inv_date_del,'%d-%m-%Y %H:%i') AS inv_date_del,DATE_FORMAT(inv_date_req,'%d-%m-%Y %H:%i') AS inv_date_req from order_inv  
        INNER JOIN invoice on invID = ord_invID 
        INNER JOIN person on perID = inv_perID  
        INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged  
        " . $condition . " and ord_isDeleted = '0' and inv_type != 'FR')
    UNION
    (select ordID,invID,ord_crt,ord_piece,item_name,per_name,per_phone,per_address,inv_code,inv_type,DATE_FORMAT(inv_date_del,'%d-%m-%Y %H:%i') AS inv_date_del,DATE_FORMAT(inv_date_req,'%d-%m-%Y %H:%i') AS inv_date_req from order_inv  
        INNER JOIN invoice on invID = ord_invID 
        INNER JOIN person on perID = inv_perID  
        INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged 
        INNER JOIN return_details on ordID = date_ordID 
        " . $condition . " and   ord_isDeleted = '0' and inv_type = 'FR' and ord_status = 1) 
        " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
//     if($show=="return")
//         $getAllFactureQuery = "select *,DATE_FORMAT(inv_date_req,'%d-%m-%Y %H:%i') AS inv_date_req from invoice INNER JOIN person on perID= inv_perID " . $condition . " and  inv_type = 'FR' and inv_status='-1'  " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
     
// }

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
// $rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        // if ($row != null AND $show=="facture") {
        //     if ($jsonData != "") {
        //         $jsonData = $jsonData . ",";
        //     }
        //     $jsonData = $jsonData . '{"invID":"' . $row['invID'] . '",';
        //     $jsonData = $jsonData . '"per_name":"' . $row['per_name'] . '",';
        //     $jsonData = $jsonData . '"per_phone":"' . $row['per_phone'] . '",';
        //     $jsonData = $jsonData . '"per_address":"' . $row['per_address'] . '",';
        //     $jsonData = $jsonData . '"inv_code":"' . $row['inv_code'] . '",';
        //     $jsonData = $jsonData . '"inv_type":"' . $row['inv_type'] . '",';
        //     $jsonData = $jsonData . '"inv_date_del":"' . $row['inv_date_del'] . '",';
        //     $jsonData = $jsonData . '"inv_date_req":"' . $row['inv_date_req'] . '"}';
        // }
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ordID":"' . $row['ordID'] . '",';
            $jsonData = $jsonData . '"invID":"' . $row['invID'] . '",';
            $jsonData = $jsonData . '"ord_crt":"' . $row['ord_crt'] . '",';
            $jsonData = $jsonData . '"ord_piece":"' . $row['ord_piece'] . '",';
            $jsonData = $jsonData . '"item_name":"' . $row['item_name'] . '",';
            $jsonData = $jsonData . '"per_name":"' . $row['per_name'] . '",';
            $jsonData = $jsonData . '"per_phone":"' . $row['per_phone'] . '",';
            $jsonData = $jsonData . '"per_address":"' . $row['per_address'] . '",';
            $jsonData = $jsonData . '"inv_code":"' . $row['inv_code'] . '",';
            $jsonData = $jsonData . '"inv_type":"' . $row['inv_type'] . '",';
            $jsonData = $jsonData . '"inv_date_del":"' . $row['inv_date_del'] . '",';
            $jsonData = $jsonData . '"inv_date_req":"' . $row['inv_date_req'] . '"}';
        }
        // if ($row != null AND $show=="return") {
        //     if ($jsonData != "") {
        //         $jsonData = $jsonData . ",";
        //     }
        //     $jsonData = $jsonData . '{"invID":"' . $row['invID'] . '",';
        //     $jsonData = $jsonData . '"per_name":"' . $row['per_name'] . '",';
        //     $jsonData = $jsonData . '"per_phone":"' . $row['per_phone'] . '",';
        //     $jsonData = $jsonData . '"per_address":"' . $row['per_address'] . '",';
        //     $jsonData = $jsonData . '"inv_code":"' . $row['inv_code'] . '",';
        //     $jsonData = $jsonData . '"inv_type":"' . $row['inv_type'] . '",';
        //     $jsonData = $jsonData . '"inv_date_req":"' . $row['inv_date_req'] . '"}';
        // }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
