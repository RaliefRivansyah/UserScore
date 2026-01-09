const { Admin } = require('../models');
const { compare, hash } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

class AuthController {
    static async register(req, res, next) {
        try {
            const { username, password } = req.body;

            const admin = await Admin.create({
                username,
                password: hash(password),
            });

            res.status(201).json({
                message: 'Register berhasil',
                admin: {
                    id: admin.id,
                    username: admin.username,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'Username dan password harus diisi' });
            }

            const admin = await Admin.findOne({
                where: { username },
            });

            if (!admin) {
                return res.status(401).json({ message: 'Username atau password salah' });
            }

            const isPasswordValid = compare(password, admin.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Username atau password salah' });
            }

            const token = signToken({
                id: admin.id,
                username: admin.username,
            });

            res.status(200).json({
                message: 'Login berhasil',
                access_token: token,
                admin: {
                    id: admin.id,
                    username: admin.username,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
