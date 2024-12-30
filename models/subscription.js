const { DataTypes } = require('sequelize');

const SubscriptionModel = (sequelize) => {
    return sequelize.define('Subscription', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        companyId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        plan: {
            type: DataTypes.ENUM('free', 'basic', 'premium'),
            defaultValue: 'free',
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
        validUntil: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });
};

module.exports = SubscriptionModel;