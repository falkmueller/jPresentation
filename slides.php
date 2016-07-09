<?php

require_once BASEDIR.'/vendor/parsedown/Parsedown.php';

class mdParser extends  Parsedown {
    
    /*override link parser for add external target attrebut to link*/
    protected function inlineLink($Excerpt)
    {
        $Element = array(
            'name' => 'a',
            'handler' => 'line',
            'text' => null,
            'attributes' => array(
                'href' => null,
                'title' => null,
            ),
        );

        $extent = 0;

        $remainder = $Excerpt['text'];

        if (preg_match('/\[((?:[^][]|(?R))*)\]/', $remainder, $matches))
        {
            $Element['text'] = $matches[1];

            $extent += strlen($matches[0]);

            $remainder = substr($remainder, $extent);
        }
        else
        {
            return;
        }

        if (preg_match('/^[(]((?:[^ ()]|[(][^ )]+[)])+)(?:[ ]+("[^"]*"|\'[^\']*\'))?[)]/', $remainder, $matches))
        {
            $Element['attributes']['href'] = $matches[1];

            if (isset($matches[2]))
            {
                $Element['attributes']['title'] = substr($matches[2], 1, - 1);
            }

            $extent += strlen($matches[0]);
        }
        else
        {
            if (preg_match('/^\s*\[(.*?)\]/', $remainder, $matches))
            {
                $definition = strlen($matches[1]) ? $matches[1] : $Element['text'];
                $definition = strtolower($definition);

                $extent += strlen($matches[0]);
            }
            else
            {
                $definition = strtolower($Element['text']);
            }

            if ( ! isset($this->DefinitionData['Reference'][$definition]))
            {
                return;
            }

            $Definition = $this->DefinitionData['Reference'][$definition];

            $Element['attributes']['href'] = $Definition['url'];
            $Element['attributes']['title'] = $Definition['title'];
        }

        $Element['attributes']['href'] = str_replace(array('&', '<'), array('&amp;', '&lt;'), $Element['attributes']['href']);
        $Element['attributes']['target'] = "_blank";
        
        if(strpos($Element['attributes']['href'], "://") === false){
            $Element['attributes']['href'] = BASEURL.'/'.$Element['attributes']['href'];
        }
        
        
        return array(
            'extent' => $extent,
            'element' => $Element,
        );
    }
    
    private function startsWith($haystack, $needle) {
        // search backwards starting from haystack length characters from the end
        return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
    }
}


/*scan slides-dir and output that ############################################*/
$Parsedown = new mdParser();

$files = scandir(BASEDIR.'/slides');
$page_id = 0;
foreach ($files as $file){
    if($file == "." || $file == ".."){ continue;}
    $page_id++;
    
    $number = current(explode("_", $file));
    $name = substr(substr($file, strlen($number) + 1),0,-3);
    $name = current(explode("~", $name));
    
    $number_split = explode(".",$number);
    $number = "";
    foreach ($number_split as $n){
        $n = intval($n);
        if(!$n) {continue;}
        if($number) {$number .= ".";}
        $number .= $n;
    }
    
    $slug = preg_replace('/[^A-Za-z0-9-]/', '', substr($file,0,-3));
    
    $content =  $Parsedown->text(file_get_contents(BASEDIR.'/slides/'.$file));
    ?>
    
    <section class="slide <?php echo $slug ?>">
        <div class="header">
            <span class="number"><?php echo $number ?></span>
            <span class="title"><?php echo $name ?></span>
        </div>
        <div class="content">
            <?php echo $content ?>
        </div>
        <span class="page_id"><?php echo $page_id ?></span>
    </section>
    
    <?php
}

?>
