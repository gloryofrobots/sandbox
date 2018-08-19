import _ from "underscore";

function rule(name, rule) {
    return {name:name, rule:rule};
}
// ["#ccc", "#669999", "#000", "#f0f", "#f00", "#0ff", "#ff0", "#00f", "#0f0"]
var DEFAULT = {
    gridWidth:10,
    gridHeight:10,
    canvasWidth:600,
    canvasHeight:600,
    interval:100,
    cellMargin:1,
    family:"gl",
    params:"23/3",
    palette: [
        "#ccc", "#669999", "#9c27b0", "#673ab7", "#3f51b5",
        "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
        "#f00", "#0ff"
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
        this._onUpdate();
        this.updated.clear();
    }

    load() {
        // console.log("LEN", localStorage.length);
        // localStorage.clear();
        this.settings =
            _.mapObject(this.default, function(val, key) {
                var cache = localStorage.getItem(key);
                console.log("<<", key, val, cache);
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
        console.log("LOAD SETTINGS", this.settings);
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
        this.triggerSave();
    }
    
    set(key, val) {
        this.settings[key] = val;
        this.updated.add(key);
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
    

    param(key) {
        return this.settings[key];
    }

    save() {
        localStorage.clear();
        _.each(this.settings, (val, key) => {
            console.log("!!",key, val);
            if(this.isArray(key)) {
                val = JSON.stringify(val);
            }
            localStorage.setItem(key, val);
        });
    }
}

export default Settings;