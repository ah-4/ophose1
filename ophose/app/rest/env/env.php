<?php

define('ROOT', "../../../../");
define('ENV_PATH', ROOT . "env/");
include_once(ROOT . 'ophose/util/file_util.php');

if (!isset($_GET['env'])) {
    echo json_encode(["error" => "Environment [" . $_GET["env"] . "] not set..."]);
    die();
}

$envName = __fixPath($_GET['env']);
define('ENV_NAME', $envName);
$oenv_path = ENV_PATH . $envName . '/'; # OphoseEnvironment path
$RESPONSE = []; # JSON final response
$__CURRENT_ERROR = "Failed at initializing response...";
$should_die = false; # if script should stop
$should_die_message = ""; # exception message

# Includes ophose configuration
include_once(ROOT . 'ophose/util/config_util.php');
# Includes ophose file util
include_once(ROOT . 'ophose/util/file_util.php');

class OphoseEnvironment
{
    /**
     * Will die at next step returning JSON
     * error (with its message)
     * @param string $msg the error message
     */
    public static function shouldDie(string $msg = "Unhandled error...")
    {
        global $__CURRENT_ERROR;
        header('HTTP/1.0 400 Not Found');
        echo $__CURRENT_ERROR . "\n" . $msg . "\n";
        die("Stopped request");
    }

    /**
     * Sets request response
     * @param mixed $result the response
     */
    public static function setResponse($result)
    {
        global $RESPONSE;
        $RESPONSE = $result;
    }

    /**
     * Includes ophose environment
     * @param string $path the environmath path
     * @return bool if well included
     */
    public static function requireEnvironment(string $path)
    {
        $path = __fixPath($path);
        if (file_exists(ENV_PATH . $path . '/env_init.php')) {
            include_once(ENV_PATH . $path . '/env_init.php');
            return true;
        }
        return false;
    }

    /**
     * Asserts that all posts are set, otherwise die.
     * @param array $posts the posts
     */
    public static function assertPosts(array $posts){
        $unsetPosts = [];
        foreach($posts as $p){
            if(!isset($_POST[$p])){
                array_push($unsetPosts, $p);
            }
        }
        if(!empty($unsetPosts)){
            self::shouldDie("");
            echo json_encode(["Missings POST parameters" => $unsetPosts, "Found" => $_POST]);
            die();
        }
    }

    // .oconf configurations

    /**
     * Returns configuration as Array with .oconf entries
     * @param string $path the environment path
     * @param string $config the config
     * @return null|array 
     */
    public static function getConfiguration(string $path, string $config) {
        $path = __fixPath($path);
        $config = __fixPath($config);
        $filePath = ENV_PATH . $path . '/config/' . $config . '.oconf';
        return OphoseConfiguration::getConfiguration($filePath);
    }
}

// Sleep ?
sleep(0);

// Start session
session_start();

// Handle not found environment error
if (!file_exists($oenv_path . 'env_init.php')) {
    $__CURRENT_ERROR = "Environment [" . $_GET["env"] . "] not found...";
    OphoseEnvironment::shouldDie();
}

include_once($oenv_path . 'env_init.php');

$__CURRENT_ERROR = "Error in environment execution (post env): ";

// Handle not found environment request error
if (!file_exists($oenv_path . 'rest/' . $_GET['request'] . '.php')) {
    $__CURRENT_ERROR = "Environment request [" . $_GET["env"] . "].[" . $_GET["request"] . "] not found...";
    OphoseEnvironment::shouldDie();
}

include_once($oenv_path . 'rest/' . $_GET['request'] . '.php');

// Handle should die error
if ($should_die) {
    $__CURRENT_ERROR = "Error in environment execution (post req)";
    OphoseEnvironment::shouldDie();
}

header('Content-Type: application/json;');
echo json_encode($RESPONSE);