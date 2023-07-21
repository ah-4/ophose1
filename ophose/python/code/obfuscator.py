import re
import string
import random

def obfuscate_js(js_code):
    # Définir les mots-clés et objets à exclure de l'obfuscation
    reserved_words = ['var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'default', 'throw', 'try', 'catch', 'finally', 'new', 'typeof', 'instanceof', 'void', 'delete', 'private', 'public', 'class']
    excluded_objects = ['console', 'console.log', 'Object', 'Array', 'Math']
    
    # Créer un dictionnaire de correspondance entre les noms de variables d'origine et les noms obfusqués
    variable_names = re.findall(r'\b(?!(?:{}|\b(?:{})\.\w+|\b\w+\.\w+)\b)\w+\b'.format('|'.join(reserved_words), '|'.join(excluded_objects)), js_code)
    variable_names = set(variable_names)
    variable_map = {}
    for name in variable_names:
        if len(name) > 1:
            replacement = ''.join(random.sample(string.ascii_lowercase, len(name)))
            variable_map[name] = replacement
    
    # Obfusquer les noms de variables
    for name, replacement in variable_map.items():
        js_code = re.sub(r'\b{}\b'.format(name), replacement, js_code)
    
    # Obfusquer les chaînes de caractères
    string_map = {}
    def replace_string(match):
        string_value = match.group(1)
        if string_value not in string_map:
            replacement = ''.join(random.sample(string.ascii_lowercase, len(string_value)))
            string_map[string_value] = replacement
        return string_map[string_value]
    
    js_code = re.sub(r'"([^"\\]*(?:\\.[^"\\]*)*)"|\'([^\'\\]*(?:\\.[^\'\\]*)*)\'', replace_string, js_code)
    
    # Supprimer les commentaires
    js_code = re.sub(r'/\*.*?\*/|//[^\n]*\n', '', js_code, flags=re.S)
    
    # Supprimer les espaces et les retours à la ligne inutiles
    js_code = re.sub(r'\s+', ' ', js_code)
    js_code = re.sub(r'([^\w])\s+([^\w])', r'\1\2', js_code)
    js_code = re.sub(r'^\s+|\s+$', '', js_code)
    
    # Supprimer les points-virgules en fin de ligne
    js_code = re.sub(r';\n', '\n', js_code)
    
    # Supprimer les espaces inutiles autour des parenthèses, crochets et accolades
    js_code = re.sub(r'\s*([\(\[\{])\s*', r'\1', js_code)
    js_code = re.sub(r'\s*([\)\]\}])\s*', r'\1', js_code)
    
    # Renommer les objets exclus de l'obfuscation
    object_map = {
        'console': 'c',
        'console.log': 'cl',
        'Object': 'O',
        'Array': 'A',
        'Math': 'M'
    }
    
    for original, replacement in object_map.items():
        js_code = re.sub(r'\b{}\b'.format(original), replacement, js_code)
    
    # Minifier les noms de variables
    js_code = re.sub(r'(\b[a-z]\b)|(\b_[a-zA-Z]\b)|(\b__[a-zA-Z0-9]\b)', minify_name, js_code)
    
    return js_code

def minify_name(match):
    name = next(name for name in match.groups() if name)
    if name.startswith('_') or name.startswith('__'):
        return name
    return name[0]

# Exemple d'utilisation
js_code = """
function myFunction() {
    var x = 10;
    console.log("Hello world!");
}
"""
obfuscated_code = obfuscate_js(js_code)
print(obfuscated_code)
