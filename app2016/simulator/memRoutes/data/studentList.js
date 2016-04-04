(function (service) {
    service.init = function (app, db, rootUrl, dataSrc) {
        var collection = db.addCollection('studentList');
        var jsonfileservice = require('../../data/jsonfileservice')();
        var studentList = jsonfileservice.getJsonFromFile(dataSrc + 'studentList.json');
        var config = require('../../app.config');
        var extend = require('extend');

        app.get(rootUrl + '/schools/:school/classes/:class/students', getStudentList);

        console.log('Seeding studentList data');
        studentList.forEach(function (item) {
            collection.insert(item);
        });

        /*
         * http://localhost:4000/api/studentList?page=1&itemsPerPage=5&sortBy=type
         * http://localhost:4000/api/studentList
         */
        function getStudentList(req, res, next) {
            var result = {},
                pagedResult,
                totalResult,
                totalItems,
                formats = {
                    integer: ['page', 'itemsPerPage']
                },
                fieldVal,
                keys,
                currentKey,
                currentVal,
                propCount = 1;

            /*
             * Paging - page, itemsPerPage
             * Sort - sortBy
             */
            totalResult = collection.chain().find({
                class: req.params.class,
                school: req.params.school
            });
            totalItems = totalResult.data().length;
            pagedResult = collection.chain()
                .find({
                    class: req.params.class,
                    school: req.params.school
                })
                .simplesort((req.query.sortColumn || ''), (req.query.sortAscending && req.query.sortAscending == 'true') ? false : true)
                .offset(parseInt((req.query.page - 1) * req.query.itemsPerPage) || 0)
                .limit(parseInt(req.query.itemsPerPage) || totalItems);

            /*
             * Add params to result
             */
            // format / conversions - integer
            for (var field = 0; field < formats.integer.length; field++) {
                fieldVal = req.query[formats.integer[field]];
                req.query[formats.integer[field]] = parseInt(fieldVal);
            }
            // apply
            extend(result, req.query);

            /*
             * Clean up result params
             */
            keys = Object.keys(result);
            for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                currentKey = keys[keyIndex];
                currentVal = result[currentKey];
                if (currentVal === undefined || currentVal == null || isNaN(currentVal) || currentVal === '') {
                    delete result[currentKey];
                }
            }

            extend(result, {
                totalItems: totalItems,
                items: pagedResult.data()
            });

            config.readRespondBack(req, res, rootUrl, result);
        }

    };
})(module.exports);
