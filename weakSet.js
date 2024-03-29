const circles = new WeakSet();

function Circle(radius) {
    circles.add(this);
    this.radius = radius;
}
Circle.prototype.calculateArea = function() {
    if(!circles.has(this)) throw "Invalid object"
    return Math.PI * this.radius * this.radius;
}
const circle1 = new Circle(10);
const circle2 = {
    radius: 5
}
console.log(circle1.calculateArea());
console.log(circle1.calculateArea.call(circle2));