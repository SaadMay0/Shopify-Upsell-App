// import upsellExt from "./app_extension/upsell.js";
import dashboard from "./dashboard.js";

export default (app) => { 
  // app.use("/api", upsellExt);
  app.use("/api/dashboard", dashboard);
};
