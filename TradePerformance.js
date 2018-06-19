/**
 * Created by lawrenceackner on 6/7/18.
 */

class TradePerformance {

    constructor(name, cost, currentCost, id) {
        this.name = name;
        this.cost = cost * 100;
        this.currentCost = currentCost * 100;  //lma todo
        this.id = id;
    }
}

module.exports = {TradePerformance};