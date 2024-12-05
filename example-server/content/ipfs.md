# Interplanetary File System (IPFS)

The **InterPlanetary File System (IPFS)** is a protocol, hypermedia and file
sharing peer-to-peer network for storing and sharing data in a distributed hash
table. By using content addressing, IPFS uniquely identifies each file in a
global namespace that connects IPFS hosts, creating a resilient system of file
storage and sharing.

IPFS allows users to host and receive content in a manner similar to
BitTorrent. As opposed to a centrally located server, IPFS is built around a
decentralized system of user-operators who hold a portion of the overall data.
Any user in the network can serve a file by its content address, and other
peers in the network can find and request that content from any node who has it
using a distributed hash table (DHT).

In contrast to traditional location-based protocols like HTTP and HTTPS, IPFS
uses content-based addressing to provide a decentralized alternative for
distributing the World Wide Web.

IPFS is used in decentralized applications and content archiving.

## Design

The InterPlanetary File System (IPFS) is a decentralized protocol, hypermedia,
and peer-to-peer (P2P) network for distributed file storage and sharing. By
using content-addressing, IPFS uniquely identifies files in a global namespace
that interlinks IPFS hosts, creating a hypermedia system that enables efficient
and reliable data distribution.

IPFS allows users to host and receive content in a manner similar to
BitTorrent. As opposed to a centrally located server, IPFS is built around a
decentralized system of user-operators who hold a portion of the overall data,
creating a resilient system of file storage and sharing. Any user in the
network can serve a file by its content address, and other peers in the network
can find and request that content from any node who has it using a distributed
hash table (DHT). In contrast to BitTorrent, IPFS aims to create a single
global network. This means that if two users publish a block of data with the
same hash, the peers downloading content from one user will also exchange data
with those downloading it from the second.

Key features of IPFS include:

 - Content-addressed file storage: Each file is uniquely identified based on
   its content hash, ensuring data integrity and facilitating efficient
   retrieval.
 - Peer-to-peer architecture: A distributed network of nodes facilitates direct
   file sharing without the need for centralized servers.
 - Versioned file system: Supports file versioning and allows users to track
   changes over time.
 - Interoperability with distributed applications: IPFS seamlessly integrates
   with decentralized applications (dApps), offering a robust storage layer for
   blockchain and Web3 ecosystems.
IPFS aims to replace protocols used for static webpage delivery by using
gateways that are accessible with HTTP. Users may choose not to install an
IPFS client on their device and instead use a public gateway. A list of these
gateways is maintained on the IPFS GitHub page.

Beyond providing an alternative for web hosting, IPFS is widely used in
decentralized applications, scientific data sharing, and content archiving,
serving as a foundational layer for the emerging decentralized
internet.
