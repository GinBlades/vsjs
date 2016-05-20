import Rx = require("rx");

class ModelBase {
    public static get(model: any, id: number) {
        return Rx.Observable.create((observer) => {
            model.findOne({ _id: id }, (err, record) => {
                if (err) {
                    observer.onError(err);
                }
                if (!record) {
                    observer.onError(404);
                } else {
                    observer.onNext(record);
                    observer.onCompleted();
                }
            });
        });
    };

    public static save(record) {
        return Rx.Observable.create((observer) => {
            record.save((err, savedRecord) => {
                if (err) {
                    observer.onError(err);
                    return;
                }
                observer.onNext(savedRecord);
                observer.onCompleted();
            });
        });
    };
}

export = ModelBase;