import { defineConfig,devices } from "@playwright/test";
export default defineConfig({testDir:"./tests/e2e",use:{baseURL:"http://localhost:3000"},webServer:{command:"npm run dev",url:"http://localhost:3000",reuseExistingServer:true},projects:[{name:"desktop",use:{...devices["Desktop Chrome"]}},{name:"mobile",use:{...devices["iPhone 13"]}}]});
