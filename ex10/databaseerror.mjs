export default class DatabaseError extends Error {
    constructor(statement, message) {
        super();
        this.statement = statement;
        this.message = message;
    }
};