class AuthController {
    constructor(registerUser: any, loginUser: any) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
    }

    async register(req: any, res: any) {
        const { name, email, password, descriptor } = req.body;

        try {

            const user = await this.registerUser.execute(name, email, password, descriptor);
            res.status(201).json(user);

        } catch (error) {
            res.status(500).json({ error: 'Failed to register user' });
        }
    }

    async login(req: any, res: any) {
        const { descriptor } = req.body;

        try {
            const user = await this.loginUser.execute(descriptor);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to login user' });
        }
    }
}

module.exports = AuthController;