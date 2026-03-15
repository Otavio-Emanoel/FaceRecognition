class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public descriptor: number[]
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.descriptor = descriptor;
    }
}
export default User