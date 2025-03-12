import { AppRootLayout } from "@/providers/app-root-layout";
import { mount } from "cypress/react";
import "./../../globals.css";
import Payment from "./page";

describe("Home Component", () => {
  it("Renderiza corretamente", () => {
    mount(
      <AppRootLayout>
        <Payment />
      </AppRootLayout>
    );

  });
});