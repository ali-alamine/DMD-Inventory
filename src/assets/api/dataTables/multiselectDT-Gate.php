<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(itemID) as exp FROM item"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if ($orderBy == 'ID') {
        $orderBy = 'itemID';
    }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = "select *,FLOOR(item_piece/item_packing_list) as item_crt from item  where item_name like '%" . $search . "%' OR item_code like '%" . $search . "%' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = "select *,FLOOR(item_piece/item_packing_list) as item_crt from item  " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['itemID'] . '",';
            $jsonData = $jsonData . '"item_is_damaged":"' . $row['item_is_damaged'] . '",';
            if ($row['item_is_damaged']) {
                $jsonData = $jsonData . '"item_name":"' . $row['item_name'] . ' | Gate ",';
            } else {
                $jsonData = $jsonData . '"item_name":"' . $row['item_name'] . ' ",';
            }
           
            $jsonData = $jsonData . '"item_code":"' . $row['item_code'] . '",';
            $jsonData = $jsonData . '"item_packing_list":"' . $row['item_packing_list'] . '",';
            $jsonData = $jsonData . '"item_crt":"' . $row['item_crt'] . '",';
            $jsonData = $jsonData . '"item_piece":"' . $row['item_piece'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
