<?php
header('Content-Type: text/html; charset=UTF-8');
mb_internal_encoding('UTF-8');


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Adjust path based on where PHPMailer is located
require '../assets/vendor/PHPMailer/PHPMailer.php';
require '../assets/vendor/PHPMailer/SMTP.php';
require '../assets/vendor/PHPMailer/Exception.php';

// Your Gmail address for receiving messages
$receiving_email_address = 'fakeipset@gmail.com';

// Validate form data
$name    = htmlspecialchars_decode($_POST['name'], ENT_QUOTES | ENT_HTML5);
$email   = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars_decode($_POST['subject'], ENT_QUOTES | ENT_HTML5);
$message = htmlspecialchars_decode($_POST['message'], ENT_QUOTES | ENT_HTML5);

// Check for empty fields
if (empty($name)) {
    http_response_code(400);
    echo "Veuillez entrer votre nom.";
    exit;
}

if (empty($email)) {
    http_response_code(400);
    echo "Veuillez entrer une adresse email.";
    exit;
}

if (empty($subject)) {
    http_response_code(400);
    echo "Veuillez entrer un sujet.";
    exit;
}

if (empty($message)) {
    http_response_code(400);
    echo "Veuillez entrer votre message.";
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Adresse email invalide.";
    exit;
}

// Initialize PHPMailer
$mail = new PHPMailer(true);

try {
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
    $mail->Subject = "Nouveau message de contact: " . mb_encode_mimeheader($subject, 'UTF-8');
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail->Body = "Vous avez reçu un nouveau message de contact:\n\n".
                  "Nom: $name\n".
                  "Email: $email\n".
                  "Sujet: $subject\n\n".
                  "Contenu:\n$message";

    // Send email
    $mail->send();
    http_response_code(200);
    echo "OK"; // Required by your form for success
} catch (Exception $e) {
    http_response_code(500);
    echo "Échec de l'envoi du message. Erreur : {$mail->ErrorInfo}";
}
?>