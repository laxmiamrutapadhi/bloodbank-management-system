<?php
header('Content-Type: application/json');
include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['username']) || empty($data['password'])) {
    echo json_encode(["status"=>"error","message"=>"Username and password required"]);
    exit;
}

$user = $conn->real_escape_string($data['username']);
$pass = $data['password'];

$result = $conn->query("SELECT * FROM users WHERE username = '$user'");
if ($result && $row = $result->fetch_assoc()) {
    if (password_verify($pass, $row['password'])) {
        echo json_encode(["status"=>"success","username"=>$row['username']]);
    } else {
        echo json_encode(["status"=>"error","message"=>"Wrong password!"]);
    }
} else {
    echo json_encode(["status"=>"error","message"=>"User not found!"]);
}
$conn->close();
?>
