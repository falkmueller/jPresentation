<?php ob_start(); ?>
<!DOCTYPE html>
<html>
  <head>
    <title>presentation.js</title>
    <meta charset="utf-8">
    <link href="<?php echo BASEURL ?>/public/css/presentation-theme.css" rel="stylesheet">
    <link href="<?php echo BASEURL ?>/public/css/style.css" rel="stylesheet">
    <link href="<?php echo BASEURL ?>/public/css/pdf.css" rel="stylesheet">
  </head>
  <body>

    <div class="page_wrapper">
        <div class="page">
            <?php require_once BASEDIR.'/slides.php' ?>
        </div>
    </div>
  </body>
</html>

<?php
$html = ob_get_contents();
ob_end_clean();

//$html; exit();

$factor = 0.75;
require_once BASEDIR.'/vendor/dompdf/autoload.inc.php';
$options = array("enable_remote" => true, "enable_html5_parser" => true);
$dompdf = new Dompdf\Dompdf($options);
$dompdf->loadHtml($html);
$dompdf->setPaper(array(0,0,960 * $factor,700 * $factor));
$dompdf->render();
$dompdf->stream();