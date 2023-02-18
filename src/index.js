import { app } from "./app.js";
import { PORT } from "./utils/config.js";
import { logInfo } from "./utils/logger.js";

app.listen(PORT, () => logInfo(`Server running on port ${PORT}`));
