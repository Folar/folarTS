/**
 * Created by lawrenceackner on 6/7/18.
 */

class TradePerformance {

    constructor(name, cost, currentCost, id,openDate,closed,realized) {
        this.name = name;
        this.cost = cost ;
        this.currentCost = currentCost ;
        this.id = id;
        this.openDate = openDate;
        this.status = closed?"Closed":"Open";
        this.realized = realized;
    }
}

module.exports = {TradePerformance};