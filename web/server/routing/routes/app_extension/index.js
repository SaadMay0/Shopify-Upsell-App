import upsellExt from "./upsell.js";

export default (app) => {
  app.use("/api", upsellExt);
};
