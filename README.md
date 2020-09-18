# Kleros - Decentralized Courts

 Kleros is the blockchain dispute resolution layer. Fast, open and affordable justice for all.
 It's an open source online dispute resolution protocol which uses blockchain and
 crowdsourcing to fairly adjudicate disputes.

## Contracts

Below mainnet contracts are indexed.
* [Kleros Liquid](https://etherscan.io/address/0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d#code)
* [MiniMeToken](https://etherscan.io/address/0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d#code)
* [PolicyRegistry](https://etherscan.io/address/0x03a9458d77dd705829fa758c64dbe770385295cc#code)

## Features:

This PoC aims to demonstrate how easily [Kleros](https://kleros.io) dispute data can be indexed and queried using GraphQL. The subgraph includes indexed dispute data from the smart
contract deployed on the Ethereum mainnet. Among the main features that can be exploited through the graph we have:

* **Up-to-date Kleros dashboard**: Dashboard data is indexed as soon as transaction is mined.
* **Aggregated statistics for Analysis**: Our subgraph aggregates user’s contributions in real-time and displays on dashboard:
  Below statistics are displayed on dashboard:
    * Total disputes created
    * Total active courts
    * Total Jurors who staked
    * Total amount staked
    * Total earnings in PNK token as well as ETH
    * Total Penalty in PNK token
    * Court table
    * Recent Disputes table
* **Charts for visualization**: Bar and Pie charts are displayed for visualization of data.
    * Bar chart for top 5 Juror who staked amount
    * Pie chart to show how many disputes fall in different dispute status like Vote, appeal or executed.

## Kleros Explorer

You can query Kleros data using the [explorer](https://thegraph.com/explorer/subgraph/napolean0/kleros).
There are saved queries which covers different business use cases.

## Contributing

If you want to contribute to the indexing of Kleros dispute data, feel free to fork the project and open a PR.

## Licence

[MIT](https://github.com/dappquery/kleros-subgraph/blob/master/LICENSE)