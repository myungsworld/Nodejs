module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        email : {
            type : DataTypes.STRING(20),
            allowNull : false,
            unique : true,
        },
        name : {
            type : DataTypes.STRING(10),
            allowNull : false,
        },
        pw : {
            type : DataTypes.STRING(15),
            allowNull : false,
        },
    },{
        timestamps : false,
    });
}