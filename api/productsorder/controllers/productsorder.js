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
        // console.log(ctx.request.body);
        const { products } = ctx.request.body;
        const {
            customer: { fullname, email, address, phone },
            total,
            user,
        } = products;
        const order = await strapi.services.productsorder.create({
            name: fullname,
            email,
            address,
            phone,
            products: products.products,
            totalPrice: total,
            users_permissions_user: user.id,
        });
        return order;
    },
};