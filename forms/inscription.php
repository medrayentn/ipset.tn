<?php
header('Content-Type: text/html; charset=UTF-8');
mb_internal_encoding('UTF-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Adjust path based on where PHPMailer is located
require '../assets/vendor/PHPMailer/PHPMailer.php';
require '../assets/vendor/PHPMailer/SMTP.php';
require '../assets/vendor/PHPMailer/Exception.php';

// Database connection settings
$host = 'localhost'; // Adjust to your database host
$dbname = 'ipset2025_db'; // Replace with your database name
$username = 'root'; // Replace with your database username
$password = ''; // Replace with your database password

// Your Gmail address for receiving inscriptions
$receiving_email_address = 'fakeipset@gmail.com';

// Validate and sanitize form data
$name     = htmlspecialchars_decode($_POST['name'], ENT_QUOTES | ENT_HTML5);
$phone    = htmlspecialchars_decode($_POST['phone'], ENT_QUOTES | ENT_HTML5);
$email    = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$city     = htmlspecialchars_decode($_POST['city'], ENT_QUOTES | ENT_HTML5);
$country  = htmlspecialchars_decode($_POST['country'], ENT_QUOTES | ENT_HTML5);
$formation = htmlspecialchars_decode($_POST['formation'], ENT_QUOTES | ENT_HTML5);

// Check for empty fields
if (empty($name)) {
    http_response_code(400);
    echo "Veuillez entrer votre nom et prénom.";
    exit;
}

if (empty($phone)) {
    http_response_code(400);
    echo "Veuillez entrer votre numéro de téléphone.";
    exit;
}

if (empty($email)) {
    http_response_code(400);
    echo "Veuillez entrer une adresse email.";
    exit;
}

if (empty($city)) {
    http_response_code(400);
    echo "Veuillez entrer votre ville.";
    exit;
}

if (empty($country)) {
    http_response_code(400);
    echo "Veuillez entrer votre pays.";
    exit;
}

if (empty($formation)) {
    http_response_code(400);
    echo "Veuillez sélectionner une formation.";
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Adresse email invalide.";
    exit;
}

try {
    // Connect to the database using PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute the INSERT query
    $stmt = $pdo->prepare("
        INSERT INTO tdemande_inscrit (nom, tel, email, ville, pays, specialite_souhaite)
        VALUES (:nom, :tel, :email, :ville, :pays, :specialite_souhaite)
    ");
    $stmt->execute([
        ':nom' => $name,
        ':tel' => $phone,
        ':email' => $email,
        ':ville' => $city,
        ':pays' => $country,
        ':specialite_souhaite' => $formation
    ]);

    // Initialize PHPMailer
    $mail = new PHPMailer(true);

    // SMTP settings for Gmail
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'fakeipset@gmail.com'; // Your Gmail address
    $mail->Password = 'pqpi tcsr pfhy ziyp'; // Replace with your 16-character App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Email content
    $mail->setFrom($email, $name);
    $mail->addAddress($receiving_email_address);
    $mail->Subject = "Nouvelle inscription: " . mb_encode_mimeheader($formation, 'UTF-8');
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail->Body = "Vous avez reçu une nouvelle inscription:\n\n".
                  "Nom et Prénom: $name\n".
                  "Téléphone: $phone\n".
                  "Email: $email\n".
                  "Ville: $city\n".
                  "Pays: $country\n".
                  "Formation: $formation";

    // Send email
    $mail->send();
    http_response_code(200);
    echo "OK"; // Required by your form for success
} catch (PDOException $e) {
    http_response_code(500);
    echo "Échec de l'enregistrement dans la base de données. Erreur : " . $e->getMessage();
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo "Échec de l'envoi du formulaire. Erreur : {$mail->ErrorInfo}";
    exit;
}
?>