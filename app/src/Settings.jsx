import _ from "underscore";

function rule(name, rule) {
    return {name:name, rule:rule};
}
// ["#ccc", "#669999", "#000", "#f0f", "#f00", "#0ff", "#ff0", "#00f", "#0f0"]
var DEFAULT = {
    gridWidth:10,
    gridHeight:10,
    cellSize:50,
    cellMargin:1,
    interval:100,
    family:"gl",
    params:"23/3",
    palette: [
        "#ccc", "#669999", "#9c27b0", "#673ab7", "#3f51b5",
        "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
        "#f00", "#0ff", 

        '#4D4D4D', '#999999', '#FFFFFF', '#F44E3B',
        '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00',
        '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
        '#333333', '#808080', '#cccccc', '#D33115',
        '#E27300', '#FCC400', '#B0BC00', '#68BC00',
        '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
        '#000000', '#666666', '#B3B3B3', '#9F0500',
        '#C45100', '#FB9E00', '#808900', '#194D33',
        '#0C797D', '#0062B1', '#653294', '#AB149E'
    ]
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
        this._onUpdate = onUpdate;
        this.onUpdate = this.onUpdate.bind(this);
        this.updated = new Set();
        this.load();
    }

    onUpdate() {
        console.log("ON UPDATE", this.updated);
        this._onUpdate();
        this.updated.clear();
    }

    updatedKeys() {
        var arr = [];
        for (let item of this.updated){
            arr.push(item);
        }

        console.log("UPDATED KEYS", arr);
        return arr;
        // return _.toArray(this.updated.values());
    }

    serialize() {
        return JSON.stringify(this.settings);
    }

    setDefaultValues() {
        localStorage.clear();
        this.load();
        this.onUpdate();
    }

    load() {
        // localStorage.clear();
        this.settings =
            _.mapObject(this.default, function(val, key) {
                var cache = localStorage.getItem(key);
                // console.log("<<", key, val, cache);
                if(_.isUndefined(cache) || _.isNull(cache)) {
                    return val;
                }

                if (_.isNumber(val)){
                    cache = parseInt(cache, 10);
                    if (_.isNaN(cache)) {
                        console.error("Invalid number in storage");
                        return 0;
                    }
                    return cache;
                } else if(_.isArray(val)) {
                    cache = JSON.parse(cache);
                    if (_.isUndefined(cache)) {
                        console.error("Invalid array in storage");
                        return [];
                    }
                    return cache;
                } else {
                    return cache;
                }
        });
        // console.log("LOAD SETTINGS", this.settings);
    }

    toObject() {
        return _.clone(this.settings);
    }

    isArray(key) {
        var old = this.default[key];
        if (_.isUndefined(old)){
            console.error("Invalid key");
            return false;
        }
        return _.isArray(old);

    }

    isNumber(key) {
        var old = this.default[key];
        if (_.isUndefined(old)){
            console.error("Invalid key");
            return false;
        }
        return _.isNumber(old);
    }

    setColor(id, val) {
        this.settings.palette[id] = val;
        this.updated.add("palette");
        this.triggerSave();
    }
    
    setString(key, val) {
        var newVal = val;
        if (this.isNumber(key)) {
            newVal = parseInt(newVal, 10);
            if (_.isNaN(newVal)) {
                console.error("Invalid settings number", val);
                return;
            }
        }
        this.set(key, val);
    }

    set(key, val) {
        this.settings[key] = val;
        this.updated.add(key);
        console.log("SET", key, val, this.updated);
        this.triggerSave();
    }


    triggerSave() {
        if(!_.isUndefined(this.saveInterval)) {
            clearTimeout(this.saveInterval);
        }
        this.saveInterval = setTimeout(
            () => {
                this.save();
                this.load();
                this.onUpdate();
            },
            500
        );
    }

    setStrings(settings) {
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
    

    get(key) {
        return this.settings[key];
    }

    save() {
        localStorage.clear();
        _.each(this.settings, (val, key) => {
            // console.log("!!",key, val);
            if(this.isArray(key)) {
                val = JSON.stringify(val);
            }
            localStorage.setItem(key, val);
        });
    }
}

export default Settings;