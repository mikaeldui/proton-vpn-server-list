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
                logical.Servers[0].ExitIP,
                nodesIpv6[logical.Domain] || (!!(16 & logical.Features) ? MSG_UNKNOWN_IPV6 : ""), // Entry IPv6
                "", // Exit IPv6
                isp ? isp.org : ""
            ])
        });

        // Guess Exit IPv6 Addresses
        var hasIpv6 = data.filter(l => l[4] != "" && l[4] != MSG_UNKNOWN_IPV6);

        hasIpv6.sort((a, b) => Number(a[1].split("#")[1]) -Number(b[1].split("#")[1]));

        Object.entries(Object.groupBy(hasIpv6, d => d[0])).forEach(
            ([_, node]) =>  {
            var prefix = node[0][4].split("::")[0];
            var suffixInt = parseInt(node[0][4].split("::")[1], 16);

            // Fix for co-01. Guess AAAA record has the wrong IP?
            if (suffixInt == 17) {
                suffixInt = 16;
            }

            // Fixes it for some servers on node-ch-15. It's a mess.
            if (suffixInt == 13) {
                suffixInt = 32;
            }
            
            node.forEach(server => {
                suffixInt++;
                server[5] = prefix + "::" + suffixInt.toString(16);
            });
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