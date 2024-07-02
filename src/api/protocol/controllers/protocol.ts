/**
 * protocol controller
 */

import { factories } from "@strapi/strapi";
const { sanitize } = require("@strapi/utils");

export default factories.createCoreController(
  "api::protocol.protocol",
  ({ strapi }) => ({
    async delete(ctx) {
      try {
        const { id } = ctx.params;

        const relatedQuestions = await strapi.entityService.findMany(
          "api::sensor.sensor",
          {
            filters: { protocol: id },
          }
        );
        if (relatedQuestions.length > 0) {
          return ctx.badRequest(
            "Make sure you removed all the sensors using this protocol first."
          );
        }
        const result = await strapi.entityService.delete(
          "api::protocol.protocol",
          id
        );
        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::protocol.protocol"),
          {
            auth: ctx.state.auth,
          }
        );
      } catch (err) {
        return ctx.badRequest(`Sensor-Type Delete Error: ${err.message}`);
      }
    },
  })
);
