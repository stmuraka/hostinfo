const os = require('os');
const http = require('http');
const hostname = os.hostname();
const port = 80;
const url = require('url');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    var call = url.parse(req.url).pathname.replace(/.*\/|\.[^.]*$/g, '');
    if (call === "all") {
        var allAttributes = '';
        Object.keys(os).map(function(method) {
            var osm = (method === "EOL" || method === "constants") ? os[method] : os[method]();
            allAttributes += '"' + method + '"' + ": " + JSON.stringify(osm) + ", ";
        })
        allAttributes = allAttributes.replace(/,(?=[^,]*$)/, "");
        res.write('{ ' + allAttributes + '}');
        res.write('\n', 'utf8');
    } else {
        try {
            var osc = (call === "EOL" || call === "constants") ? os[call] : os[call]();
            res.write('{ "' + call + '"' + ": " +
                JSON.stringify(osc) +
                ' }');
            res.write('\n', 'utf8');
        } catch (e) {
            var allAttributes = '"' + Object.keys(os).join('", "') + '"';
            res.write('{ '+
                '"Server": "' + hostname + '", ' +
                '"Valid attributes": [' + allAttributes + '] ' +
                ' }'
            );
            res.write('\n', 'utf8');
            res.end('\n');
        }
    }
    res.end('\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
