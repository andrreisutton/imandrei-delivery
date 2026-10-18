import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./project";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "andreisutton",
  deployment: { appId: "yn929dqig4vuj0jcxuihr07o" },
});
