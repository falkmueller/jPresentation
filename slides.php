<?php

require_once BASEDIR.'/vendor/parsedown/Parsedown.php';
$Parsedown = new Parsedown();

$files = scandir(BASEDIR.'/slides');
$page_id = 0;
foreach ($files as $file){
    if($file == "." || $file == ".."){ continue;}
    $page_id++;
    $content =  $Parsedown->text(file_get_contents(BASEDIR.'/slides/'.$file));
    ?>
    
    <section>
            <?php echo $file.$content ?>
            <span class="page_id"><?php echo $page_id ?></span>
    </section>
    
    <?php
}

?>
