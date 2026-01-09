const { verifyToken } = require('../helpers/jwt');
const { Admin } = require('../models');

const authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) throw { name: 'Unauthorized' };

        const access_token = authorization.split(' ')[1];

        const payload = verifyToken(access_token);

        const admin = await Admin.findOne({
            where: {
                id: payload.id,
            },
        });

        if (!admin) throw { name: 'Unauthorized' };

        req.loginInfo = {
            adminId: admin.id,
            username: admin.username,
        };

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = authentication;
