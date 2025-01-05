$(document).ready( function () {
    //$.noConflict();

    async function myFunction() {

        var logRes = await fetch("logicals.json");
        var logJson = await logRes.json();

        const logicals = logJson.LogicalServers;
        const nodesIpv6 = await (await fetch("nodes-ipv6.json")).json();
        var ipinfoResp = await fetch("ipinfo.csv");
        var ipinfoText = await ipinfoResp.text();
        const ipinfo = $.csv.toObjects(ipinfoText);

        const data = [];

        logicals.filter(l => l.Servers.length == 1).forEach(logical => {
            var isp = ipinfo.find(i => i.ip == logical.Servers[0].ExitIP);
            data.push([
                logical.Domain,
                logical.Name,
                logical.EntryCountry,
                logical.Servers[0].EntryIP,
                logical.Servers[0].ExitIP,
                nodesIpv6[logical.Domain] || "",
                isp ? isp.org : ""
            ])
        });

        var table = $('#table').DataTable({
            data: data,
            pageLength: 25,
            search: {
                search: '::'
            }
        });
    }


    myFunction();
} );