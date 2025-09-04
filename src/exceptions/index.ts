import { AppExceptionHandler } from "./handlers/app-exception-handler";
import { GlobalExceptionHandler } from "./handlers/global-exception-handler";
import { TypeBoxExceptionHandler } from "./handlers/type-box-exception-handler";

const appExceptionHandler = new AppExceptionHandler();
const typeBoxExceptionHandler = new TypeBoxExceptionHandler();

export const globalExceptions = new GlobalExceptionHandler(
  appExceptionHandler,
  typeBoxExceptionHandler
);
