export class Helpers extends Array{

  constructor(fromCoin: string[], toCoin: string){
    super();
    fromCoin.forEach(coin => {
      this.push([coin, toCoin]);
    });
  }

  override toString() : string {
    return JSON.stringify(this);
  }

}
