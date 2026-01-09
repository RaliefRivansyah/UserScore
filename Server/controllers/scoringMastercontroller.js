const { InformationGroup, GroupItem, Item } = require('../models');

class ScoringMasterController {
    static async findAll(req, res, next) {
        try {
            const data = await InformationGroup.findAll({
                include: [
                    {
                        model: GroupItem,
                        as: 'group_items',
                        include: [
                            {
                                model: Item,
                                as: 'items',
                            },
                        ],
                    },
                ],
                order: [
                    ['id', 'ASC'],
                    [{ model: GroupItem, as: 'group_items' }, 'id', 'ASC'],
                    [{ model: GroupItem, as: 'group_items' }, { model: Item, as: 'items' }, 'id', 'ASC'],
                ],
            });

            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ScoringMasterController;
