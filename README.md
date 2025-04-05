# proton-vpn-server-list
Another Proton VPN Server List

Available on: https://mikaeldui.github.io/proton-vpn-server-list/

Files:
- ipinfo.csv: created at ipinfo.io by uploading all EntryIPs from logicals (note, doesn't contain info about exit IPs). 50,000 free IP lookups per month. They also offer a free downloadable database with ISP names.
- logicals.json: simply a copy of https://api.protonvpn.ch/vpn/v1/logicals, more info can be found in the official Proton client repos on GitHub.
- nodes-ipv6.json: I have a script that loops through the node addresses and checks if they have AAAA records.
- nodes.json: what I used to generate nodes-ipv6.json.

Exit IPv6 addresses are just guessed and most are wrong. There doesn't seem like Proton is following any system when assigning them, but they are (generally) in the same subnet as the entry IP.
