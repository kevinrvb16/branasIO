export default class Parser {
    constructor() {
        this.command = new Map(
            [
                ["createTable", /create table ([a-z]+) \((.+)\)/],
                ["insert",  /insert into ([a-z]+) \((.+)\) values \((.+)\)/],
                ["select", /select (.+) from ([a-z]+)(?: where (.+))?/],
                ["delete", /delete from ([a-z]+)(?: where (.+))?/]
            ]
        );
    }
    parse = function (statement) {
        for(let [command, regexp] of this.command) {
            const parsedStatement = statement.match(regexp);
            if(parsedStatement) {
                return {
                    command,
                    parsedStatement
                };
            }
        }
    }
};