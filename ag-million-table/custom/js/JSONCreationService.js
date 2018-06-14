main.service('JSONCreationService',
    function () {
        let list = [];
        let
            nameList = [{ id: 1, name: 'Pierre' }, { id: 2, name: 'Pol' }, { id: 3, name: 'Jacques' }, { id: 4, name: 'Robert' }, { id: 5, name: 'Elisa' }],
            familyName = [{ id: 1, name: 'Dupont' }, { id: 2, name: 'Germain' }, { id: 3, name: 'Delcourt' }, { id: 4, name: 'bjip' }, { id: 5, name: 'Menez' }],
            nationList = [{ id: 1, name: 'USA' }, { id: 2, name: 'France' }, { id: 3, name: 'Germany' }],
            educationList = [{ id: 1, name: 'Doctorate' }, { id: 2, name: 'Master' }, { id: 3, name: 'Bachelor' }, { id: 4, name: 'High school' }];

        this.execute = function () {
            for (var j = 1; j < 1000; j++) {
                list.push(createRandomItem(j));
            };
            return list;
        }

        function createRandomItem(index) {
            var firstName = nameList[Math.floor(Math.random() * 5)].name,
                lastName = familyName[Math.floor(Math.random() * 5)].name,
                nationality = nationList[Math.floor(Math.random() * 3)].name,
                education = educationList[Math.floor(Math.random() * 4)].name,
                summary = {
                    e: educationList[Math.floor(Math.random() * 4)].name + 'sum',
                    n: nameList[Math.floor(Math.random() * 5)].name + 'sum',
                    f: familyName[Math.floor(Math.random() * 5)].name + 'sum',
                    n: nationList[Math.floor(Math.random() * 3)].name + 'sum',
                    ed: educationList[Math.floor(Math.random() * 4)].name + 'sum',
                };

            return {
                id: index,
                firstName: firstName,
                lastName: lastName,
                nationality: nationality,
                education: education,
                summary: summary,
                visible: true,
                selected: false
            }
        };
    });