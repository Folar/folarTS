/**
 * Created by lawrenceackner on 6/7/18.
 */
class Result {
    constructor () {
        this.T_TYPE = 0;
        this.UNDERLYING = 1;
        this.EXP = 2;
        this.MID = 3;
        this.STRIKE = 4;
        this.T_ACTION = 5;
        this.MAG = 6;
        this.result = 0;
        this.name = "";
        this.id = 0;
        this.cnt = 0;
    }
    fail() {
        this.result = 0;
    }

    Result() {
        this.result = 1;
        this.name = "";
        this.id = 0;
    }


    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    setId(id) {
        this.id = id;
    }


}
module.exports = {Result};