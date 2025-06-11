$(document).ready( function () {
    //$.noConflict();

    async function myFunction() {

        const MSG_UNKNOWN_IPV6 = ":: (Yes, but unknown)";

        var logRes = await fetch("logicals.json?2025-06-11");
        var logJson = await logRes.json();

        const logicals = logJson.LogicalServers;
        const nodesIpv6 = await (await fetch("nodes-ipv6.json?2025-06-11")).json();
        var ipinfoResp = await fetch("ipinfo.csv?2025-06-11");
        var ipinfoText = await ipinfoResp.text();
        const ipinfo = $.csv.toObjects(ipinfoText);

        const data = [];

        logicals.filter(l => l.Servers.length == 1).forEach(logical => {
            var isp = ipinfo.find(i => i.ip == logical.Servers[0].ExitIP);
            data.push([
                logical.Domain,
                logical.Name,
                logical.Servers[0].EntryIP,
                nodesIpv6[logical.Domain] || (!!(16 & logical.Features) ? MSG_UNKNOWN_IPV6 : ""), // Entry IPv6
                isp ? isp.org : "",
                isp ? isp.city + ", " + isp.region : ""
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