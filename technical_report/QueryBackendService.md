# Query service

The CRYK service is handling all queries over a HTTP connection
The service is divided into multiple miro-services with all queries being perfomed via SPARQL queries.

## CryptoMetadataService

The CryptoMetadataService is a HyperGraphQL service that provides cryptocurrency meta-data. The service is based on the [HyperGraphQL]("https://github.com/hypergraphql/hypergraphql"). It does so by querying the triple store for the requested data.

## CoinPriceCatalogService

The CoinPriceCatalogService is a microservice that provides cryptocurrency price data from a trusted data source. It then stores the values in a key-value store, and provides the data to the PriceCatalogClientService that feeds that information to the front-end using a Data access layer.

## RealTimePriceService

The RealTimePriceService is a websocket server that provides real-time cryptocurrency price data to the front-end. It does so by querying the CoinPriceCatalogService for the requested data.