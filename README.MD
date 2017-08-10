
 Volem tenir un servidor de pagines web

 En aquesta pagina es veuen totes les IPs dels socis de guifi.net de Torrelles i el seu estat.

 Aixi, el nostre programa fa :

    1er llegeix una llista de socis del fitxer socis.json (nom + ip de moment)
    2on cada 4 segons fa "ping" a una IP de la llista per saber si es activa
    3er cada 3 minuts genera un fitxer HTML, anomenat "pagina.html"

 El client ha de llegir el fitxer "pagina.html" una sola vegada
     ja que despres es recarrega automaticament cada 30 segons

 Fitxers del directori :

    1_gen_html.js        - codi del programa
    2_do_ping.py         - codi en python que fa el "ping"
    5_test_ping.js       - proves de fer anar "2_do_ping.py" des nodejs
    6_test_json.js       - proves de llegir JSON des un fitxer de texte, config.json
    config.json          - fitxer de texte amb format JSON
    .git                 - configuracio del GIT
    .gitignore           - llista de fitxers que no es guarden al projecte GIT
    node_modules         - moduls de nodejs que li calen al projecte
    package.json         - configuracio del software del projecte
    public               - fitxers HTML que fem servir, CSS, FAVICON, etc
    README.MD            - descripcio del projecte
    ru.sh                - shell per engegar el programa en mode "SU"
    socis.json           - configuracio del programa : llista de socis que tenim i les seves IPs, en format JSON

 Requisits :

    nodejs               - ens dona el web server
    python               - ens permet fer ping()

En el Raspberry (es un Linux) funciona amb

 $ node -v   : v 5.12.0
 $ python -V : v 2.7.9

