const { User, UserAnswer, InformationGroup, GroupItem, Item, sequelize } = require('../models');

class UserController {
    static async calculateScore(answers) {
        const infoGroups = await InformationGroup.findAll({
            include: [
                {
                    model: GroupItem,
                    as: 'group_items',
                    include: [{ model: Item, as: 'items' }],
                },
            ],
        });

        let totalInfoGroupWeight = 0;
        let weightedScoreSum = 0;

        for (const group of infoGroups) {
            totalInfoGroupWeight += group.weight;
            let groupScore = 0;
            let totalGroupItemWeight = 0;

            for (const gItem of group.group_items) {
                totalGroupItemWeight += gItem.weight;
            }

            for (const gItem of group.group_items) {
                const answer = answers.find((a) => a.group_item_id === gItem.id);
                if (answer) {
                    const selectedItem = gItem.items.find((i) => i.id === answer.item_id);
                    if (selectedItem) {
                        const normalizedWeight = totalGroupItemWeight > 0 ? gItem.weight / totalGroupItemWeight : 0;
                        groupScore += selectedItem.value * normalizedWeight;
                    }
                }
            }

            weightedScoreSum += groupScore * group.weight;
        }

        const finalScore = totalInfoGroupWeight > 0 ? weightedScoreSum / totalInfoGroupWeight : 0;
        return parseFloat(finalScore.toFixed(2));
    }

    static determineRiskLevel(score) {
        if (score < 55) return 'HIGH RISK';
        if (score >= 55 && score <= 70) return 'MEDIUM RISK';
        return 'LOW RISK';
    }

    static async create(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { name, birth_place, birth_date, gender, postal_code, address, answers } = req.body;

            const total_score = await UserController.calculateScore(answers);
            const risk_level = UserController.determineRiskLevel(total_score);

            const user = await User.create(
                {
                    name,
                    birth_place,
                    birth_date,
                    gender,
                    postal_code,
                    address,
                    total_score,
                    risk_level,
                },
                { transaction }
            );

            if (answers && answers.length > 0) {
                const userAnswers = answers.map((answer) => ({
                    user_id: user.id,
                    group_item_id: answer.group_item_id,
                    item_id: answer.item_id,
                }));
                await UserAnswer.bulkCreate(userAnswers, { transaction });
            }

            await transaction.commit();

            const result = await User.findByPk(user.id, {
                include: [
                    {
                        model: UserAnswer,
                        as: 'user_answers',
                        include: [
                            { model: GroupItem, as: 'group_item' },
                            { model: Item, as: 'item' },
                        ],
                    },
                ],
            });

            res.status(201).json(result);
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    static async findAll(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'total_score', 'risk_level'],
                order: [['id', 'ASC']],
            });
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    static async findById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, {
                include: [
                    {
                        model: UserAnswer,
                        as: 'user_answers',
                        include: [
                            {
                                model: GroupItem,
                                as: 'group_item',
                                include: [
                                    {
                                        model: InformationGroup,
                                        as: 'information_group',
                                    },
                                ],
                            },
                            { model: Item, as: 'item' },
                        ],
                    },
                ],
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { name, birth_place, birth_date, gender, postal_code, address, answers } = req.body;

            const user = await User.findByPk(id, { transaction });
            if (!user) {
                await transaction.rollback();
                return res.status(404).json({ message: 'User not found' });
            }

            const total_score = await UserController.calculateScore(answers);
            const risk_level = UserController.determineRiskLevel(total_score);

            await user.update(
                {
                    name,
                    birth_place,
                    birth_date,
                    gender,
                    postal_code,
                    address,
                    total_score,
                    risk_level,
                },
                { transaction }
            );

            if (answers) {
                await UserAnswer.destroy({ where: { user_id: id }, transaction });

                if (answers.length > 0) {
                    const userAnswers = answers.map((answer) => ({
                        user_id: id,
                        group_item_id: answer.group_item_id,
                        item_id: answer.item_id,
                    }));
                    await UserAnswer.bulkCreate(userAnswers, { transaction });
                }
            }

            await transaction.commit();

            const result = await User.findByPk(id, {
                include: [
                    {
                        model: UserAnswer,
                        as: 'user_answers',
                        include: [
                            { model: GroupItem, as: 'group_item' },
                            { model: Item, as: 'item' },
                        ],
                    },
                ],
            });

            res.status(200).json(result);
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }

    static async delete(req, res, next) {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            const user = await User.findByPk(id, { transaction });
            if (!user) {
                await transaction.rollback();
                return res.status(404).json({ message: 'User not found' });
            }

            await UserAnswer.destroy({ where: { user_id: id }, transaction });
            await user.destroy({ transaction });

            await transaction.commit();
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    }
}

module.exports = UserController;
