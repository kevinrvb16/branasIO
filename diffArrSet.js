let array = [10, 10, 10];
let set = []
array.forEach(function (element) {
    if(!set.includes(element)) {
        set.push(element);
    }
})
console.log(set);