import _ from "underscore";

function rule(name, rule) {
    return {name:name, rule:rule};
}

var DEFAULT = {
    gridWidth:10,
    gridHeight:10,
    canvasWidth:600,
    canvasHeight:600,
    interval:100,
    countSteps:-1,
    cellMargin:1,
    family:"gl",
    params:"23/3",
    palette: JSON.stringify([
        '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B',
        '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00',
        '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
        '#333333', '#808080', '#cccccc', '#D33115',
        '#E27300', '#FCC400', '#B0BC00', '#68BC00',
        '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
        '#000000', '#666666', '#B3B3B3', '#9F0500',
        '#C45100', '#FB9E00', '#808900', '#194D33',
        '#0C797D', '#0062B1', '#653294', '#AB149E'
    ])
};

const RULES = {
    "bb":[],
    "gl": [
        rule("Conway's Life", "23/3"),
        rule("2x2", "125/36"),
        rule("34Life", "34/34"),
        rule("Amoeba", "1358/357"),
        rule("Assimilaion", "4567/345"),
        rule("Coagulations", "23567/378"),
        rule("Coral", "45678/3"),
        rule("Day&Night", "34678/3678"),
        rule("Seeds", "/2"),
        rule("Serviettes", "/234"),
        rule("WalledCities", "2345/45678"),
    ]
};

class Settings {
    constructor(onUpdate){
        this.default = _.clone(DEFAULT);
        this.settings = undefined;
        this.onUpdate = onUpdate;
        this.load();
    }

    load() {
        // console.log("LEN", localStorage.length);
        this.settings =
            _.mapObject(this.default, function(val, key) {
                var cache = localStorage.getItem(key);
                console.log("<<", key, val, cache);
                if(cache === undefined) {
                    return val;
                }

                if (typeof val === "number"){
                    cache = parseInt(cache, 10);
                    if (_.isNaN(cache)) {
                        console.error("Invalid number in storage");
                        return 0;
                    }
                    return cache;
                } else {
                    return cache;
                }
        });
    }

    toObject() {
        return _.clone(this.settings);
    }
    // parse(key, val) {
    //     if(isNumber(key)
    //                 cache = parseInt(cache, 10);
    //                 if (_.isNaN(cache)) {
    //                     console.error("Invalid number in storage");
    //                     return 0;
    //                 }
    //                 return cache;

    // }
    isNumber(key) {
        var old = this.default[key];
        if (_.isUndefined(old)){
            console.error("Invalid key");
            return false;
        }
        return typeof old === "number";
    }

    update(settings) {
        this.settings = _.mapObject(this.default, (val, key) => {
            var newVal = settings[key];
            if (_.isUndefined(newVal)){
                console.error("Missing setting", key);
                return val;
            }
            if (this.isNumber(key)) {
                newVal = parseInt(newVal, 10);
                if (_.isNaN(newVal)) {
                    console.error("Invalid settings number");
                    return val;
                }
            }
            return newVal;
        });
        this.save();
        //TODO REMOVE AFTER TESTING 
        this.load();
        this.onUpdate();
    }

    getRules(family) {
        return RULES[family];
    }

    getRule(family) {
        var rules = this.getRules(family);
        if (rules.length === 0){
            return undefined;
        }
        return rules[0].rule;
    }
    
    param(key) {
        return this.settings[key];
    }

    save() {
        localStorage.clear();
        _.each(this.settings, function(val, key) {
            console.log("!!",key, val);
            localStorage.setItem(key, val);
        });
    }
}

export default Settings;