<?php
include './connection.php';
openConn();
$show=$_GET['show'];
$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";
if($show=="facture")
    $rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(invID) as exp FROM invoice"))['exp'];
if($show=="items")
    $rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(ordID) as exp FROM order_inv"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    // if ($orderBy == 'invID') {
    //     $orderBy = 'IID';
    // }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];
    if($show=="facture")
        $getAllFactureQuery = "select * from invoice INNER JOIN person on perID= inv_perID  where (inv_date_req like '%" . $search . "%' OR per_name like '%" . $search . "%' OR inv_code like '%" . $search . "%' ) and inv_status = '0' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    if($show=="items")
        $getAllFactureQuery = "select * from order_inv  INNER JOIN invoice on invID = ord_invID INNER JOIN person on perID = inv_perID  INNER JOIN item on itemID = ord_itemID 
         where (inv_date_req like '%" . $search . "%' OR per_name like '%" . $search . "%' OR inv_code like '%" . $search . "%' OR inv_type like '%" . $search . "%' OR item_name like '%" . $search . "%') and ord_isDeleted = '0' and inv_status = '0'
          " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {
    if($show=="facture")
        $getAllFactureQuery = "select * from invoice INNER JOIN person on perID= inv_perID where  inv_status = '0'  " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
    if($show=="items")
        $getAllFactureQuery = "select * from order_inv INNER JOIN invoice on invID = ord_invID  INNER JOIN person on perID= inv_perID  INNER JOIN item on itemID = ord_itemID  where ord_isDeleted = '0' and inv_status = '0'
         " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
// $rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null AND $show=="facture") {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"invID":"' . $row['invID'] . '",';
            $jsonData = $jsonData . '"per_name":"' . $row['per_name'] . '",';
            $jsonData = $jsonData . '"per_phone":"' . $row['per_phone'] . '",';
            $jsonData = $jsonData . '"per_address":"' . $row['per_address'] . '",';
            $jsonData = $jsonData . '"inv_code":"' . $row['inv_code'] . '",';
            $jsonData = $jsonData . '"inv_type":"' . $row['inv_type'] . '",';
            $jsonData = $jsonData . '"inv_date_del":"' . date($row['inv_date_del']) . '",';
            $jsonData = $jsonData . '"inv_date_req":"' . date($row['inv_date_req']) . '"}';
        }
        if ($row != null AND $show=="items") {
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
            $jsonData = $jsonData . '"inv_date_del":"' . date($row['inv_date_del']) . '",';
            $jsonData = $jsonData . '"inv_date_req":"' . date($row['inv_date_req']) . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
