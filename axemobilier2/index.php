<?php
// En-têtes de sécurité
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
header('Content-Security-Policy: default-src \'self\'; img-src \'self\' data: blob: https:; style-src \'self\' \'unsafe-inline\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; connect-src \'self\' data: blob:; worker-src \'self\' blob:;');

// Fonction pour obtenir le type MIME correct
function getMimeType($filename) {
    $mime_types = array(
        'js'    => 'application/javascript',
        'mjs'   => 'application/javascript',
        'css'   => 'text/css',
        'html'  => 'text/html',
        'json'  => 'application/json',
        'map'   => 'application/json',
        'png'   => 'image/png',
        'jpg'   => 'image/jpeg',
        'jpeg'  => 'image/jpeg',
        'gif'   => 'image/gif',
        'svg'   => 'image/svg+xml',
        'webp'  => 'image/webp'
    );
    
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return isset($mime_types[$ext]) ? $mime_types[$ext] : 'application/octet-stream';
}

// Vérifier si le fichier existe dans le dossier dist
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file_path = __DIR__ . '/dist' . $request_uri;

if (file_exists($file_path) && !is_dir($file_path)) {
    $mime_type = getMimeType($file_path);
    header('Content-Type: ' . $mime_type . '; charset=UTF-8');
    
    // Gestion du cache pour les assets
    if (strpos($request_uri, '/assets/') !== false) {
        $cache_time = 31536000; // 1 an
        header('Cache-Control: public, max-age=' . $cache_time);
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $cache_time) . ' GMT');
    } else {
        header('Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
    }
    
    readfile($file_path);
    exit;
}

// Si aucun fichier n'est trouvé, servir index.html
header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/dist/index.html');
?>