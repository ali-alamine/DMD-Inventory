<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$condition = "WHERE 1 ";
$item_is_damaged = "item_is_damaged = ";

if (isset($_GET['gate'])) {
    $gateFlag = $_GET['gate'];

    if ($gateFlag == 0) {
        $condition = $condition . "AND item_is_damaged = 0 ";
    } else if ($gateFlag == 1) {
        $condition = $condition . "AND item_is_damaged = 1 ";
    }
}

if (isset($_GET['qunatityStatus'])) {
    $qunatityStatus = $_GET['qunatityStatus'];

    if ($qunatityStatus == 0) {
        $condition = $condition . " AND item_piece < 1 ";
    } else if ($qunatityStatus == 1) {
        $condition = $condition . " AND item_piece > 0 ";
    }
}

if (isset($_GET['deactivated'])) {
    $deactivated = $_GET['deactivated'];

    if ($deactivated == 1) {
        $condition = $condition . " AND item_isActivated = 1 ";
    } else if ($deactivated == 0) {
        $condition = $condition . " AND item_isActivated = 0 ";
    }
}


if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];    

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = "select *,FLOOR(item_piece/item_packing_list) as crt from item  where name like '%" . $search . "%' OR phone like '%" . $search . "%' OR address like '%" . $search . "%' OR subscriber_detail.profile like '%" . $search . "%' OR exp_date like '%" . $search . "%' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = " select *,FLOOR(item_piece/item_packing_list) as crt from item " . $condition . " " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "select COUNT(*) as exp from item " . $condition))['exp'];

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"itemID":"' . $row['itemID'] . '",';
            $jsonData = $jsonData . '"item_is_damaged":"' . $row['item_is_damaged'] . '",';
            $jsonData = $jsonData . '"item_code":"' . $row['item_code'] . '",';
            $jsonData = $jsonData . '"item_isActivated":"' . $row['item_isActivated'] . '",';
            $jsonData = $jsonData . '"item_name":"' . $row['item_name'] . '",';
            $jsonData = $jsonData . '"item_packing_list":"' . $row['item_packing_list'] . '",';
            $jsonData = $jsonData . '"crt":"' . $row['crt'] . '",';
            $jsonData = $jsonData . '"item_piece":"' . $row['item_piece'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
