<?php
header('Content-Type: application/json');
include "connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['username']) || empty($data['email']) || empty($data['password'])) {
    echo json_encode(["status"=>"error","message"=>"All fields required"]);
    exit;
}

$user  = $conn->real_escape_string($data['username']);
$email = $conn->real_escape_string($data['email']);
$pass  = password_hash($data['password'], PASSWORD_BCRYPT);

$check = $conn->query("SELECT id FROM users WHERE username='$user' OR email='$email'");
if ($check && $check->num_rows > 0) {
    echo json_encode(["status"=>"error","message"=>"User or email already exists!"]);
} else {
    $sql = "INSERT INTO users (username, email, password) VALUES ('$user', '$email', '$pass')";
    if ($conn->query($sql)) {
        echo json_encode(["status"=>"success"]);
    } else {
        echo json_encode(["status"=>"error","message"=>"Registration failed: ".$conn->error]);
    }
}
$conn->close();
?>
