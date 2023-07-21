<?php
class OphoseConfiguration{

    /**
     * Returns configuration as Array with .oconf entries and automatic .local merge
     */
    public static function getConfiguration(string $path) {
        if (!file_exists($path)) {
            return null;
        }
        $configArray = json_decode(file_get_contents($path), true);

        if (file_exists($path . '.local')) {
            $configLocalArray = json_decode(file_get_contents($path . '.local'), true);
            $configArray = array_replace_recursive($configArray, $configLocalArray);
        }
        
        return $configArray;
    }
}