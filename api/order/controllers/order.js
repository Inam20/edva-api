'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
     * create a/an order record
     *
     * return {Object}
     */

     create: async (ctx) => {
        const { courses } = ctx.request.body;
        const {
        customer: {},
            total,
            user,
        } = courses;
        const order = await strapi.services.order.create({
            name: user.username,
            email: user.email,
            courses: courses.courses,
            totalPrice: total,
            users_permissions_user: user.id,
        });
        return order;
    },
};