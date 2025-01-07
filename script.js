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
                logical.Servers[0].EntryIP,
                logical.Servers[0].ExitIP,
                nodesIpv6[logical.Domain] || "", // Entry IPv6
                "", // Exit IPv6
                isp ? isp.org : ""
            ])
        });

        var hasIpv6 = data.filter(l => l[4] != "" );
        const makeIpNumber = (ip) => Number(
            ip.split('.')
              .map((subString) => (`00${subString}`).slice(-3))
              .join('')
          );

        hasIpv6.sort((a, b) => makeIpNumber(a[3]) - makeIpNumber(b[3]));

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