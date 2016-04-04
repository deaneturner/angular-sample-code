(function (service) {
    service.init = function (app, db, rootUrl, dataSrc) {
        var uuid = require('node-uuid');
        var collection = db.addCollection('students');
        var jsonfileservice = require('../../data/jsonfileservice')();
        var students = jsonfileservice.getJsonFromFile(dataSrc + 'students.json');
        var config = require('../../app.config');

        //app.get(rootUrl + '/getStudentReports', getStudentReports);
        app.get(rootUrl + '/classes/selected/studentAnalytics', getAllStudents);
        app.get(rootUrl + '/students', getAllStudents);
        app.get(rootUrl + '/students/:studentId', getStudentForId);
        app.post(rootUrl + '/students', postStudentForId);
        app.put(rootUrl + '/students', putStudentForId);
        app.put(rootUrl + '/students/:studentId/enrollments', putStudentForId);

        console.log('Seeding Student reports data');
        students.forEach(function (item) {
            collection.insert(item);
        });

        function getAllStudents(req, res, next) {
            var students = collection.find();
            config.readRespondBack(req, res, rootUrl, students);
        }

        function getStudentForId(req, res, next) {
            var id = req.params.studentId;

            var students = collection.where(function (obj) {
                return obj.person.systemId === id;
            });
            if (!students) {
                res.status(500).send({error: 'Can\'t find the student with id: ' + id});
            }
            config.readRespondBack(req, res, rootUrl, {
                status: true,
                message: '',
                meta: {
                    'grade': {
                        'list': [
                            'PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
                        ]
                    },
                    ayp: {
                        map: {
                            'ECONOMICALLY_DISADVANTAGED': 'Economically Disadvantaged',
                            'GIFTED_TALENTED': 'Gifted and Talented',
                            'LIMITED_ENGLISH': 'Limited English Proficiency',
                            'MIGRANT': 'Migrant',
                            'STUDENT_WITH_DISABILITY': 'Student’s with Disabilities'
                        }
                    },
                    ethnicity: {
                        map: {
                            'American_Indian_Alaskan_Native': 'American Indian/Alaskan Native',
                            'Asian': 'Asian',
                            'Black_African_American': 'Black/African American',
                            'Hispanic': 'Hispanic',
                            'Pacific_Islander': 'Pacific Islander',
                            'White_Caucasian': 'White/Caucasian',
                            'Two_or_More_Races': 'Two or More Races'
                        }
                    },
                    gender: {
                        map: {
                            'male': 'Male',
                            'female': 'Female'
                        }
                    },
                    classesOfUser: {
                        map: {
                            '005mrcaetddah3frssnn841u_h910h03': 'Read 180',
                            '07f2mo7ukm1066ir4goprdkj_h910h03': 'System 44',
                            '0542mo7ukm1066ir4goprdkj_h910h03': 'System 45',
                            '077r2moukm1066ir4goprdkj_h910h03': 'System 46',
                            '03r5mo7ukm1066ir4goprdkj_h910h03': 'System 47',
                            '5etbmo7ukm1066ir4goprdkj_h910h03': 'System 48',
                            '6l54mo7ukm1066ir4goprdkj_h910h03': 'System 49',
                            '9052mo7ukm1066ir4goprdkj_h910h03': 'System 50'
                        }
                    },
                    'guardian.relationship': {
                        'multiValue': true,
                        'required': false,
                        'map': {
                            'MOTHER': 'Mother',
                            'FATHER': 'Father',
                            'MOTHER_FATHER_IN_LAW': 'Mother-in-law or Father-in-law',
                            'FOSTER_MOTHER': 'Foster Mother',
                            'FOSTER_FATHER': 'Foster Father',
                            'ADOPTIVE_MOTHER': 'Adoptive Mother',
                            'ADOPTIVE_FATHER': 'Adoptive Father',
                            'ADOPTIVE_PARENTS': 'Adoptive Parents',
                            'FOSTER_PARENTS': 'Foster Parents',
                            'STEPMOTHER': 'Stepmother',
                            'STEPFATHER': 'Stepfather',
                            'GODMOTHER': 'Godmother',
                            'GODFATHER': 'Godfather',
                            'GODPARENTS': 'Godparents',
                            'GRANDMOTHER': 'Grandmother',
                            'GRANDFATHER': 'Grandfather',
                            'GRANDPARENTS': 'Grandparents',
                            'GREAT_AUNT': 'Great Aunt',
                            'UNCLE_AUNT': 'Uncle or Aunt',
                            'SPOUSE': 'Spouse'
                        }
                    }
                },
                items: [students[0]]
            });
        }

        function putStudentForId(req, res, next) {
            var id,
                data,
                updatedDoc,
                students;

            data = req.body;
            id = data.person.systemId;

            students = collection.where(function (obj) {
                return obj.person.systemId === id;
            });

            if (!students) {
                res.status(500).send({error: 'Can\'t find the student with id: ' + id});
            }

            updatedDoc = collection.update(data);

            config.readRespondBack(req, res, rootUrl, {
                status: true,
                message: '',
                items: updatedDoc
            });
        }

        function postStudentForId(req, res, next) {
            var id,
                data,
                createdDoc,
                students;

            data = req.body;
            id = data.person.systemId;

            data.systemId = uuid.v1();
            data.iri = data.person.systemId;
            data.userId = id;
            delete data.$loki;
            createdDoc = collection.insert(data);

            config.readRespondBack(req, res, rootUrl, {
                status: true,
                message: '',
                items: [createdDoc]
            });
        }
    };
})(module.exports);
