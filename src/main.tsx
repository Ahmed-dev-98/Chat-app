import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/constants/router.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { SWRConfig } from "swr";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <SWRConfig
        value={{
          revalidateIfStale: false,
          revalidateOnMount: true,
          revalidateOnFocus: false,
          dedupingInterval: 60000,
          loadingTimeout: 4000,
          errorRetryCount: 3,
        }}
      >
        <App />
        <Toaster />
      </SWRConfig>
    </Provider>
  </StrictMode>
);
