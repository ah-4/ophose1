<?php

/**
 * Returns fixed path ('/my/path/' -> 'my/path')
 * @param string $path the path
 * @return string
 */
function __fixPath(string $path)
{
    $fixedPath = $path;
    if (substr($fixedPath, -1) == "/") {
        $fixedPath = substr($fixedPath, 0, strlen($fixedPath) - 1);
    }
    if (substr($fixedPath, 0, 1) == "/") {
        $fixedPath = substr($fixedPath, 1, strlen($fixedPath) - 1);
    }
    return $fixedPath;
}