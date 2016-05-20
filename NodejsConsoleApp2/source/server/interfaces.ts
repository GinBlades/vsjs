interface UserProperties {
    bio: string;
    createdAt: Date;
    displayName: string;
    password: string;
    username: string;
}

interface MongooseModel<T> {
    new(obj: any);
    findOne: Function;
    findById: Function;
    findByIdAndUpdate: Function;
    findByIdAndRemove: Function;
    find: Function;
    save: Function;
}
