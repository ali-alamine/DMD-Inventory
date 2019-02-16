<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$condition = "WHERE 1 ";
if (isset($_GET['invoiceType']) && $_GET['invoiceType'] != "-1") {
    $invoiceType = $_GET['invoiceType'];
    $condition = $condition . " AND inv_type IN(" . $invoiceType . ") ";

}

if (isset($_GET['clientID']) && $_GET['clientID'] != "-1" && $_GET['clientID'] != "") {
    $clientID = $_GET['clientID'];
    $condition = $condition . " AND perID IN (" . $clientID . ") ";

}

if (isset($_GET['fromDate']) && isset($_GET['toDate']) && $_GET['fromDate'] != "") {
    $fromDate = $_GET['fromDate'];
    $toDate = $_GET['toDate'];
    $condition = $condition . " AND ( inv_date_req between '" . $fromDate . "' AND '" . $toDate . "' ) ";
}

if (isset($_GET['fromCode']) && isset($_GET['toCode']) && $_GET['fromCode'] != "" && $_GET['toCode'] != "") {
    $fromCode = $_GET['fromCode'];
    $toCode = $_GET['toCode'];
    $condition = $condition . " AND cast(SUBSTRING(inv_code,3) AS UNSIGNED ) between ".$fromCode." and ".$toCode;
}

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    // $getAllFactureQuery = "select * invoice  where name like '%" . $search . "%' OR phone like '%" . $search . "%' OR address like '%" . $search . "%' OR subscriber_detail.profile like '%" . $search . "%' OR exp_date like '%" . $search . "%' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = " select * from ((select ordID,invID,ord_crt,ord_piece,item_name,perID,per_name,per_phone,per_address,inv_code,inv_type,DATE_FORMAT(inv_date_del,'%d-%m-%Y') AS inv_date_del,DATE_FORMAT(inv_date_req,'%d-%m-%Y') AS inv_date_req from order_inv INNER JOIN invoice on invID = ord_invID INNER JOIN person on perID = inv_perID INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged where ord_isDeleted = '0' and inv_type != 'FR') UNION (select ordID,invID,ord_crt,ord_piece,item_name,perID,per_name,per_phone,per_address,inv_code,inv_type,DATE_FORMAT(inv_date_del,'%d-%m-%Y') AS inv_date_del,DATE_FORMAT(inv_date_req,'%d-%m-%Y') AS inv_date_req from order_inv INNER JOIN invoice on invID = ord_invID INNER JOIN person on perID = inv_perID INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged INNER JOIN return_details on ordID = date_ordID where ord_isDeleted = '0' and inv_type = 'FR' and ord_status = 1)) as dd " . $condition . " " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "select count(*) as exp from ((select ordID,invID,ord_crt,ord_piece,item_name,perID,per_name,per_phone,per_address,inv_code,inv_type,DATE_FORMAT(inv_date_del,'%d-%m-%Y') AS inv_date_del,DATE_FORMAT(inv_date_req,'%d-%m-%Y') AS inv_date_req from order_inv INNER JOIN invoice on invID = ord_invID INNER JOIN person on perID = inv_perID INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged where ord_isDeleted = '0' and inv_type != 'FR') UNION (select ordID,invID,ord_crt,ord_piece,item_name,perID,per_name,per_phone,per_address,inv_code,inv_type,DATE_FORMAT(inv_date_del,'%d-%m-%Y') AS inv_date_del,DATE_FORMAT(inv_date_req,'%d-%m-%Y') AS inv_date_req from order_inv INNER JOIN invoice on invID = ord_invID INNER JOIN person on perID = inv_perID INNER JOIN item on itemID = ord_itemID and item_is_damaged = ord_item_isDamaged INNER JOIN return_details on ordID = date_ordID where ord_isDeleted = '0' and inv_type = 'FR' and ord_status = 1)) as dd " . $condition))['exp'];

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
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
    }
}
$jsonData = '[' . $jsonData . ']';
file_put_contents("yawwx.txt",$jsonData);
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
