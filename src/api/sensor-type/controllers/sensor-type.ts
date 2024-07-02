/**
 * sensor-type controller
 */

import { factories } from "@strapi/strapi";
const { sanitize } = require("@strapi/utils");

export default factories.createCoreController(
  "api::sensor-type.sensor-type",
  ({ strapi }) => ({
    async delete(ctx) {
      try {
        const { id } = ctx.params;

        const relatedQuestions = await strapi.entityService.findMany(
          "api::sensor.sensor",
          {
            filters: { sensor_type: id },
          }
        );
        if (relatedQuestions.length > 0) {
          return ctx.badRequest(
            "Make sure you removed all the sensors using this sensor-type first."
          );
        }
        const result = await strapi.entityService.delete(
          "api::sensor-type.sensor-type",
          id
        );
        return await sanitize.contentAPI.output(
          result,
          strapi.contentType("api::sensor-type.sensor-type"),
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
