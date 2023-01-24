export interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  rank: number;
  price_usd: number;
  price_btc: number;
  description: string;
}


// {
//   Cryptocurrency_GET_BY_ID(uris: ["http://purl.org/net/bel-epa/doacc#Df625a2c6-3455-43b8-b2b1-83d5be6aa671"]) {
//   _type
//   _id
//   symbol
//   totalCoins
//   prefLabel
//   pow {
//     _id
//     _type
//     description
//     isDefinedBy {
//       _id
//       _type
//     }
//     prefLabel
//   }
//   pos {
//     _id
//     _type
//     description
//     isDefinedBy
//     prefLabel
//   }
//   website
//   description
//   image
//   distributionScheme {
//     _id
//     _type
//     description
//     isDefinedBy {
//       _id
//       _type
//     }
//     prefLabel
//   }
//   comment
//   incept
//   blockTime
//   maturation
//   source
//   protocol {
//     _id
//     _type
//     description
//     isDefinedBy {
//       _id
//       _type
//     }
//     prefLabel
//   }
//   confirmations
//   blockReward
//   dateFounded
//   cloneOf {
//     _id
//     _type
//   }
//   rewardModifier
//   retargetTime
//   premine
//   protectionScheme {
//     _id
//     _type
//     description
//     isDefinedBy {
//       _id
//       _type
//     }
//     prefLabel
//   }
// }
// }
