
 El nostre programa fa :

    1er - llegeix una llista de socis del fitxer "entrada.json" amb (nom + ip) - uns 50 elements
    2on - cada 4 segons fa "ping" a una IP de la llista per saber si es activa - uns 200 segons
    3er - cada 5 minuts genera un fitxer HTML, anomenat "pagina.html"          - uns 300 segons
    4rt - te un web server al port 3001

 El client pot accedir-hi des un browser amb la URL http://ip_o_nom-del-servidor:3001

 Si un agent FTP ho envia a Internet, sera a https://torrelles-guifi.000webhostapp.com/pagina.html

 El client ha de llegir el fitxer "pagina.html" una sola vegada ja que despres es recarrega automaticament cada 30 segons

 Fitxers del directori :

    1_gen_html.js        - codi del programa
    2_do_ping.py         - codi en python que fa el "ping"
    5_test_ping.js       - proves de fer anar "2_do_ping.py" des nodejs
    6_test_json.js       - proves de llegir JSON des un fitxer de texte, config.json
    7_test_wget.js       - proves de fer anar "wget" del nodejs
    config.json          - fitxer de texte amb format JSON
    entrada.json         - fitxer de entrada al programa : llista de socis que tenim i les seves IPs, en format JSON
    .git                 - configuracio del GIT
    .gitignore           - llista de fitxers que no es guarden al projecte GIT
    node_modules         - moduls de nodejs que li calen al projecte
    package.json         - configuracio del software del projecte
    public               - fitxers HTML que fem servir, CSS, FAVICON, etc
    README.MD            - descripcio del projecte (aquest fitxer)
    ru.sh                - shell per engegar el programa - es crida des rc.local via pomnia_restart amb usuari root

 Requisits :

    nodejs               - ens dona el web server
    python               - ens permet fer ping()

When we modify the code we do :

    git status                  - display changed files
    git commit -am "comentari"  - commit files to send
    git push -u origin master   - send files


Comprovat :

    Opsys : linux Raspberry 
    $ node -v      :        v5.12.0
    $ python -V    : Python 2.7.9

    Opsys : linux Ubuntu 14.04 LTS 32-bit
    $ node -v      :        v8.3.0
    $ python .V    : Python 2.7.6

    Opsys : Windows Server 2008 64-bit
    C:\> node -v   :        v4.4.7
    C:\> python -V : Python 2.7.11
.
