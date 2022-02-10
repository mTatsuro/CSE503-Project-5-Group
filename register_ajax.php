<?php
require 'database.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$new_username = (string) $json_obj['new_username'];
$new_password = (string) $json_obj['new_password'];
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check if the new username is already used
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE username=?");
$stmt->bind_param('s', $new_username);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

// Alow to create the username only when it is valid
if($cnt == 0 && preg_match('/^[\w_\-]+$/', $new_username)){
  $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
  $stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
  if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
	  exit;
  }
  $stmt->bind_param('ss', $new_username, $hashed_password);
  $stmt->execute();
  $stmt->close();

  ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['username'] = $username;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

	echo json_encode(array(
		"success" => true,
    "token" => $_SESSION['token']
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Username is already taken"
	));
	exit;
}
?>
