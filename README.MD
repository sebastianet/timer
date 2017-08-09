
 Volem tenir un servidor de pagines web

    1er llegeix una llista de socis del fitxer socis.json (nom + ip de moment)
    2on cad 5 segons fa "ping" a una IP per saber si es activa
    3er cada 5 minuts genera un fitxer HTML pagina.html

 El client ha de llegir el fitxer HTML una sola vegada
 i despres es recarrega automaticament cada 30 segons

 En aquesta pagina web es veuen totes les IPs dels socis de guifi.net de Torrelles
 i el seu estat.


-rw-r--r--  1 pi pi 7205 Aug  9 20:42 1_gen_html.js        - codi del programa
-rwxr--r--  1 pi pi  646 Aug  9 18:55 2_do_ping.py         - codi en python que fa el "ping"
-rw-r--r--  1 pi pi 1582 Aug  9 19:17 5_test_ping.js
-rw-r--r--  1 pi pi  529 Aug  9 20:31 6_test_json.js
-rw-r--r--  1 pi pi  242 Aug  9 20:01 config.json  
drwxr-xr-x  8 pi pi 4096 Aug  9 20:42 .git
-rw-r--r--  1 pi pi   84 Aug  9 15:37 .gitignore
drwxr-xr-x 46 pi pi 4096 Aug  9 18:13 node_modules
-rw-r--r--  1 pi pi  493 Aug  9 18:13 package.json         - configuracio del software del projecte
drwxr-xr-x  2 pi pi 4096 Aug  9 16:35 public
-rw-r--r--  1 pi pi    0 Aug  9 20:43 README.MD            - descripcio del projecte
-rwxr--r--  1 pi pi   20 Aug  9 17:43 ru.sh
-rw-r--r--  1 pi pi  265 Aug  9 20:40 socis.json           - configuracio del programa

