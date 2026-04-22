<?php
header('Content-Type: application/json');
include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status"=>"error","message"=>"No data received"]);
    exit;
}

$name    = $conn->real_escape_string($data['fullName']  ?? '');
$bg      = $conn->real_escape_string($data['bloodGroup']?? '');
$age     = (int)($data['age'] ?? 0);
$phone   = $conn->real_escape_string($data['phone']     ?? '');
$city    = $conn->real_escape_string($data['city']      ?? '');
$state   = $conn->real_escape_string($data['state']     ?? '');
$address = $conn->real_escape_string($data['address']   ?? '');

if (!$name || !$bg || !$age || !$phone || !$city || !$state) {
    echo json_encode(["status"=>"error","message"=>"All required fields must be filled"]);
    exit;
}

$sql = "INSERT INTO donors (fullName, bloodGroup, age, phone, city, state, address)
        VALUES ('$name', '$bg', $age, '$phone', '$city', '$state', '$address')";

if ($conn->query($sql)) {
    echo json_encode(["status"=>"success"]);
} else {
    echo json_encode(["status"=>"error","message"=>"Database error: ".$conn->error]);
}
$conn->close();
?>
