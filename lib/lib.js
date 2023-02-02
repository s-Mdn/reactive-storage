'use strict';


class ReactiveStorage {
    constructor() {

    }

    static install (app, options) {
        return new Storage(app, options);
    }
}

export default ReactiveStorage