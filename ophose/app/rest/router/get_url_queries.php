<?php

$BASE = "../../../../";
require_once($BASE . "ophose/util/str_util.php");

/**
 * Returns true if file at path exists (admetting it ends with '.js') or path added with '.php' exists
 * but not the both
 */
function ophoseComponentExists(string $path)
{
    $jsFileExists = file_exists($path);
    return [$jsFileExists, $path];
}

/**
 * Returns URL path for dynamic JS routed components.
 * Must be called as "your/full/url"
 * 
 */
function getURLPath(string $path)
{

    global $BASE;

    $path_files = explode("/", $path);
    $request_path = "";
    $vars = [];
    $exists = false;

    for ($i = 0; $i < count($path_files) && !$exists; $i++) {

        $current_path = $path_files[$i];
        $existing = ophoseComponentExists($BASE . $request_path . $current_path . '.js');
        $isExisting = $existing[0];
        $exisingPath = $existing[1];

        if ($i == count($path_files) - 1 && $isExisting) {
            $request_path .= $exisingPath;
            $exists = true;
            break;
        }

        $analizing_path = $BASE . $request_path;
        foreach (scandir($analizing_path) as $tmp_path) {
            if (is_dir($analizing_path . '/' . $tmp_path) && (startsWith($tmp_path, "_") || strtolower($tmp_path) == strtolower($current_path))) {
                $request_path .= $tmp_path . '/';
                $var_name = startsWith($tmp_path, "_") ? substr($tmp_path, 1, strlen($tmp_path)) : $tmp_path;
                $vars[$var_name] = $current_path;
                if ($i == count($path_files) - 1) {
                    $indexExisting = ophoseComponentExists($analizing_path . "index.js");
                    $indexIsExisting = $indexExisting[0];
                    $indexExisingPath = $indexExisting[1];
                    if ($indexExisting) {
                        $request_path = ophoseComponentExists($BASE . $request_path . 'index.js')[1];
                        $exists = true;
                    }
                }
            }
        }
    }

    $exploded_path = explode("../", $request_path);

    return [
        "valid" => $exists,
        "path" => '/' . end($exploded_path),
        "variables" => $vars
    ];
}

$url = isset($_POST['url']) ? $_POST['url'] : "error";
if(is_dir($BASE . $url)) {
    $url .= "/index";
}
$rest_response = getURLPath($url);
echo json_encode($rest_response);

?>