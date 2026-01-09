'use strict';
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const dataPath = path.resolve(__dirname, '../data/data.json');
        const rawData = fs.readFileSync(dataPath);
        const data = JSON.parse(rawData);

        // Arrays to hold data for bulkInsert
        const informationGroupsData = [];
        const groupItemsData = [];
        const itemsData = [];

        // Helper references to manage IDs (since we are seeding in one go, we can simulate auto-increment if we were using transactions or return values,
        // but bulkInsert generally doesn't return inserted IDs easily for nested relationships without querying back.
        // HOWEVER, for simple seeders it's unreliable to guess IDs.
        // Best practice for relational seeders without model usage is to insert, then query, then insert next level.

        // 1. Insert Information Groups
        for (const group of data.information_groups) {
            // Prepare group data
            const now = new Date();
            informationGroupsData.push({
                code: group.code,
                name: group.name,
                weight: group.weight,
                createdAt: now,
                updatedAt: now,
            });
        }

        await queryInterface.bulkInsert('information_groups', informationGroupsData, {});

        // Dictionary to map group code to ID
        const insertedGroups = await queryInterface.sequelize.query(`SELECT id, code FROM information_groups;`);
        const groupRows = insertedGroups[0];
        const groupMap = {};
        groupRows.forEach((row) => {
            groupMap[row.code] = row.id;
        });

        // 2. Prepare Group Items
        for (const group of data.information_groups) {
            const groupId = groupMap[group.code];
            if (!groupId) continue;

            for (const gItem of group.group_items) {
                const now = new Date();
                groupItemsData.push({
                    information_group_id: groupId,
                    name: gItem.name,
                    weight: gItem.weight,
                    createdAt: now,
                    updatedAt: now,
                });
            }
        }

        await queryInterface.bulkInsert('group_items', groupItemsData, {});

        // Dictionary to map (group_id + name) to group_item_id because names might not be unique globally but unique per group?
        // Actually names like "Umur Pemohon" might repeat? Probably not in this dataset but let's be safe.
        // We can fetch all group_items.

        const insertedGroupItems = await queryInterface.sequelize.query(`SELECT id, information_group_id, name FROM group_items;`);
        const groupItemRows = insertedGroupItems[0];

        // 3. Prepare Items
        // We need to iterate again to match items to their group_item_id
        // This is tricky because we need to match exactly which group_item belongs to which group from the JSON structure.
        // A heuristic: Iterate the JSON again, find the corresponding DB record by matching group_id and name.

        for (const group of data.information_groups) {
            const groupId = groupMap[group.code];

            for (const gItem of group.group_items) {
                // Find the ID of this group item in DB
                // Filter by groupId and name
                const dbGroupItem = groupItemRows.find((row) => row.information_group_id === groupId && row.name === gItem.name);

                if (dbGroupItem) {
                    for (const item of gItem.items) {
                        const now = new Date();
                        itemsData.push({
                            group_item_id: dbGroupItem.id,
                            label: item.label,
                            value: item.value,
                            createdAt: now,
                            updatedAt: now,
                        });
                    }
                }
            }
        }

        if (itemsData.length > 0) {
            await queryInterface.bulkInsert('items', itemsData, {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('items', null, {});
        await queryInterface.bulkDelete('group_items', null, {});
        await queryInterface.bulkDelete('information_groups', null, {});
    },
};
