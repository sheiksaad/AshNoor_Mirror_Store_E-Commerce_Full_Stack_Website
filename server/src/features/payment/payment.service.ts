import { easypaisaMockGateway } from "./easypaisa.mock.js";
import type { PaymentGateway } from "./payment.types.js";

// Single source of truth for which gateway is active — swap this one line
// when real EasyPaisa credentials are ready, e.g.:
// export const activeGateway: PaymentGateway = env.EASYPAISA_MODE === "live" ? easypaisaLiveGateway : easypaisaMockGateway;
export const activeGateway: PaymentGateway = easypaisaMockGateway;