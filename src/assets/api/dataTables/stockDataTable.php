<?php
include './connection.php';
openConn();
$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(itemID) as exp FROM item  where item_isActivated = 1 AND item_is_damaged = 0 "))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];

    if ($orderBy == 'pck_list') {
        $orderBy = 'item_packing_list';
    }
    if ($orderBy == 'code') {
        $orderBy = 'item_code';
    }
    if ($orderBy == 'piece') {
        $orderBy = 'item_piece';
    }
    if ($orderBy == 'crt') {
        $orderBy = 'item_crt';
    }
    if ($orderBy == 'name') {
        $orderBy = 'item_name';
    }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = " SELECT * FROM item left join (select item.itemID , item_is_damaged as isDamagedFlag, item_crt as crtD, item_piece as pieceD FROM item where item_is_damaged = 1 ) as d on item.itemID = d.itemID where item_isActivated=1 AND item_is_damaged= 0 AND ( item_name like '%" . $search . "%' OR item_code like '%" . $search . "%' ) " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = " SELECT * FROM item left join (select item.itemID as itemIDD , item_is_damaged as isDamagedFlag, item_crt as crtD, item_piece as pieceD FROM item where item_is_damaged = 1 ) as d on item.itemID = d.itemIDD where item_isActivated = 1 AND item_is_damaged = 0 " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

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
            $jsonData = $jsonData . '{"code":"' . $row['item_code'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['item_name'] . '",';
            $jsonData = $jsonData . '"pck_list":"' . $row['item_packing_list'] . '",';
            $jsonData = $jsonData . '"crt":"' . $row['item_crt'] . '",';
            $jsonData = $jsonData . '"piece":"' . $row['item_piece'] . '",';
            $jsonData = $jsonData . '"isDamagedFlag":"' . $row['isDamagedFlag'] . '",';
            $jsonData = $jsonData . '"crtD":"' . $row['crtD'] . '",';
            $jsonData = $jsonData . '"pieceD":"' . $row['pieceD'] . '",';
            $jsonData = $jsonData . '"id":"' . $row['itemID'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
