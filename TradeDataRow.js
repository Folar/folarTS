/**
 * Created by lawrenceackner on 6/7/18.
 */

class TradeDataRow {

    //row = [];




    constructor(arr) {
         this.call["delta"] = arr[2];
         this.call["gamma"] = arr[3];
         this.call["theta"] = arr[4];
         this.call["vega"] = arr[5];
         this.call["last"] = arr[6];
         this.call["lx"] = arr[7];
         this.call["mid"] = arr[8];
         this.call["volume"] = arr[9];
         this.call["iv"] = arr[10];
         this.call["bid"] = arr[11];
         this.call["bx"] = arr[12];
         this.call["ask"] = arr[13];
         this.call["ax"] = arr[14];

        this.expiration = arr[15];
        this.strikePrice = arr[16];

         this.put["bid"] = arr[17];
         this.put["bx"] = arr[18];
         this.put["ask"] = arr[19];
         this.put["ax"] = arr[20];
         this.put["delta"] = arr[21];
         this.put["gamma"] = arr[22];
         this.put["theta"] = arr[23];
         this.put["vega"] = arr[24];
         this.put["last"] = arr[25];
         this.put["lx"] = arr[26];
         this.put["mid"] = arr[27];
         this.put["volume"] = arr[28];
         this.put["iv"] = arr[29];


    }
}
module.exports = {TradeDataRow};