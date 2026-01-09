const { InformationGroup, GroupItem, Item } = require('../models');

class ScoreCalculator {
    static getTotalGroupItemWeight(groupItems) {
        let total = 0;
        for (const groupItem of groupItems) {
            total += groupItem.weight;
        }
        return total;
    }

    static findUserAnswer(answers, groupItemId) {
        return answers.find((answer) => answer.group_item_id === groupItemId);
    }

    static findSelectedItem(items, itemId) {
        return items.find((item) => item.id === itemId);
    }

    static calculateGroupScore(group, answers) {
        let groupScore = 0;

        const totalWeight = ScoreCalculator.getTotalGroupItemWeight(group.group_items);

        for (const groupItem of group.group_items) {
            const userAnswer = ScoreCalculator.findUserAnswer(answers, groupItem.id);

            if (userAnswer) {
                const selectedItem = ScoreCalculator.findSelectedItem(groupItem.items, userAnswer.item_id);

                if (selectedItem) {
                    const normalizedWeight = totalWeight > 0 ? groupItem.weight / totalWeight : 0;

                    groupScore += selectedItem.value * normalizedWeight;
                }
            }
        }

        return groupScore;
    }

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

        let totalGroupWeight = 0; 
        let weightedScoreSum = 0; 

        for (const group of infoGroups) {
            totalGroupWeight += group.weight;

            const groupScore = ScoreCalculator.calculateGroupScore(group, answers);

            weightedScoreSum += groupScore * group.weight;
        }

        const finalScore = totalGroupWeight > 0 ? weightedScoreSum / totalGroupWeight : 0;

        return parseFloat(finalScore.toFixed(2));
    }

    static determineRiskLevel(score) {
        if (score < 55) return 'HIGH RISK';
        if (score >= 55 && score <= 70) return 'MEDIUM RISK';
        return 'LOW RISK';
    }
}

module.exports = ScoreCalculator;
