
import { fieldsImage } from "../helpers";

export const populating = () => {
  return async (ctx, next) => {
    ctx.query.populate = {
      pictures: {
        fields: fieldsImage,
      },
      categories: {
        fields: ["name", "slug"],
      },
      promotion: {
        fields: ["*"],
      },
    };

    return next();
  };
};
