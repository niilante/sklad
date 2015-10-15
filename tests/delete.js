describe('Delete operations', function () {
    var dbName = 'dbName' + Math.random();
    var conn;

    function openConnection(cb) {
        openBaseConnection(dbName, function (connection) {
            conn = connection;
            cb();
        });
    }

    function closeConnection(cb) {
        if (conn) {
            conn.close();
            conn = null;

            cb();
        }
    }

    beforeEach(openConnection);

    it('should produce DOMError.NotFoundError when wrong object stores are used', function (done) {
        conn.delete('missing_object_store', 'some_key').then(function () {
            done.fail('Delete returns resolved promise');
        }).catch(function (err) {
            expect(err.name).toEqual('NotFoundError');
            done();
        });
    });

    it('should not throw error when missing key is passed', function (done) {
        conn.delete('keypath_true__keygen_false_2', 'missing_key').then(done).catch(function () {
            done.fail('Delete returns rejected promise');
        });
    });

    it('should delete records from one store', function (done) {
        conn.delete('keypath_true__keygen_false_0', 'whatever_key').then(done).catch(function () {
            done.fail('Delete returns rejected promise');
        });
    });

    it('should delete records from multiple stores', function (done) {
        conn.delete({
            'keypath_true__keygen_false_0': ['whatever_key', 1, []],
            'keypath_true__keygen_false_1': [
                'smth',
                'whatever_wherever',
                IDBKeyRange.bound('lower', 'upper', true, true)
            ]
        }).then(done).catch(function () {
            done.fail('Delete returns rejected promise');
        });
    });

    afterEach(closeConnection);
});
