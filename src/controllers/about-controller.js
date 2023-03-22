/**
 * About Controller within the application
 * @Author: Caroline Daly
 */

export const aboutController = {
  index: {
    handler: function (request, h) {
      const viewData = {
        title: "About TrailMark",
      };
      return h.view("about-view", viewData);
    },
  },
};
