# Application flow

## Introduction
CRYK is a statless service vending access to a cryptocurrency RDF data representation. It's main application is for viewing cryptocurrency data in a web browser. The service is designed to be used by a web browser, but can be used by any application that can make HTTP requests, with the appropriate response being delivered.


## Request handling
The BEM backend is divided into multiple miro-services with all queries being perfomed via SPARQL queries.
Based on API accessed, the service handles:
- Providing cryptocurrencies meta-data, by querying HyperGraphQL CryptoMetadataService.
- Providing cryptocurrency price data, from the CoinPriceCatalogService.
- Provide real-time price data, using a Websocket connection to the CoinPriceCatalogService.
