<?php
require 'database.php';
ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$id = (string) $json_obj['id'];
$username = $_SESSION['username'];

// Make sure the safety against CSRF
if(!hash_equals($_SESSION['token'], (string) $json_obj['token'])){
  echo json_encode(array(
		"success" => false,
		"message" => "Request forgery detected"
	));
	exit;
}

// Check if the user is authorized to delete this event
$stmt = $mysqli->prepare("SELECT username FROM events WHERE id=?");
$stmt->bind_param('s', $id);
$stmt->execute();
$stmt->bind_result($event_username);
$stmt->fetch();
$stmt->close();

if ($event_username == $username) {
  $stmt = $mysqli->prepare("delete from events where id=?");
  if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
  }
  $stmt->bind_param('s', $id);
  $stmt->execute();
  $stmt->close();

  echo json_encode(array(
    "success" => true
  ));
  exit;
} else {
  echo json_encode(array(
		"success" => false,
		"message" => "You are not authorized to delete this event"
	));
	exit;
}

?>
