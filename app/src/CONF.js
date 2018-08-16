
let CONF = {};
CONF.GRID_WIDTH = 10;
CONF.GRID_HEIGHT= 10;
CONF.CANVAS_WIDTH = 600;
CONF.CANVAS_HEIGHT = 600;
CONF.INTERVAL = 100;
CONF.COUNT_STEPS = -1;
// CONF.cell_width = 30;
// CONF.cell_height = 30;
CONF.CELL_MARGIN = 5;
CONF.FAMILY = "gl";
CONF.PARAMS = "23/3";

function rule(name, rule) {
    return {name:name, rule:rule};
}
CONF.RULES = {
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
}

Object.freeze(CONF);

export default CONF;


