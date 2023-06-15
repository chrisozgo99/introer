import { render, screen } from "@testing-library/react";
import App from "@pages/content/components/app";

describe("appTest", () => {
  test("render text", () => {
    // given
    const text = "You need to log in";

    // when
    render(<App />);

    // then
    screen.getByText(text);
  });
});
