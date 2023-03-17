const timeUnits = new Map();
timeUnits.set('second', 1);
timeUnits.set('minute', 60);
timeUnits.set('hour', 3600);
timeUnits.forEach( function (value, key) {
    console.log(key, value);
});

const object = {};
object[10] = "Number";
object["10"] = "String";
object[true] = "Boolean";
object["true"] = "String";
console.log(object[10]);
console.log(object["10"]);
console.log(object[true]);
console.log(object["true"]);

const mapp = new Map();
mapp.set(20, "Number");
mapp.set("20", "String");
mapp.set(true, "Boolean");
mapp.set("true", "String");

console.log(mapp.get(20));
console.log(mapp.get("20"));
console.log(mapp.get(true));
console.log(mapp.get("true"));

const obj = {};
console.log("toString" in obj);
console.log("valueOf" in obj);

const map = new Map();
console.log(map.get("toString"));