const { User } = require('../models');
const { compare } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

class AuthController {
    static async register(req, res) {
        try {
            const { username, password } = req.body;

            const user = await User.create({
                username,
                password,
            });

            res.status(201).json({
                message: 'Register berhasil',
                user: {
                    id: user.id,
                    username: user.username,
                },
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map((err) => err.message);
                res.status(400).json({ errors });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'Username dan password harus diisi' });
            }

            const user = await User.findOne({
                where: { username },
            });

            if (!user) {
                return res.status(401).json({ message: 'Username atau password salah' });
            }

            const isPasswordValid = compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Username atau password salah' });
            }

            const token = signToken({
                id: user.id,
                username: user.username,
            });

            res.status(200).json({
                message: 'Login berhasil',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                },
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = AuthController;
