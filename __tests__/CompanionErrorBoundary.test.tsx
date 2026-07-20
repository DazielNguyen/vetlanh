/**
 * Unit tests for components/illustrations/CompanionErrorBoundary.tsx
 *
 * The happy path (no error) is exercised with a real render via
 * react-dom/server's renderToStaticMarkup (no jsdom in this repo), following
 * the pattern in __tests__/LevelGate.test.tsx / __tests__/CompanionCharacter.test.tsx.
 *
 * The error path is NOT exercisable through a full renderToStaticMarkup pass:
 * React's legacy synchronous server renderer (renderToString/
 * renderToStaticMarkup) does not run error-boundary recovery for errors
 * thrown by descendants — the error propagates out of the render call
 * itself instead of being caught by getDerivedStateFromError/
 * componentDidCatch (that recovery only happens client-side / in the
 * streaming Fizz renderer, neither of which this repo has set up). This was
 * confirmed empirically: wrapping a throwing child and calling
 * renderToStaticMarkup rethrows the error rather than yielding "".
 *
 * So the error-path lifecycle is unit-tested directly against the exported
 * class's static/instance methods instead — this is the same contract React
 * itself invokes when it *does* catch an error (getDerivedStateFromError to
 * compute next state, componentDidCatch for the side-effecting log, then a
 * re-render of the instance with the updated state), just driven manually
 * rather than through a full reconciler pass.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { CompanionErrorBoundary } from "@/components/illustrations/CompanionErrorBoundary";

describe("CompanionErrorBoundary — happy path (real render)", () => {
  it("renders children normally when there is no error", () => {
    const markup = renderToStaticMarkup(
      <CompanionErrorBoundary>
        <span>SAFE_CHILD</span>
      </CompanionErrorBoundary>
    );

    expect(markup).toContain("SAFE_CHILD");
  });

  it("supports multiple children when there is no error", () => {
    const markup = renderToStaticMarkup(
      <CompanionErrorBoundary>
        <span>first</span>
        <span>second</span>
      </CompanionErrorBoundary>
    );

    expect(markup).toContain("first");
    expect(markup).toContain("second");
  });

  it("does not log any error when there is no error", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    renderToStaticMarkup(
      <CompanionErrorBoundary>
        <span>SAFE_CHILD</span>
      </CompanionErrorBoundary>
    );

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

describe("CompanionErrorBoundary — error-path lifecycle contract (direct method testing)", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("starts with hasError: false", () => {
    const instance = new CompanionErrorBoundary({ children: "child" });
    expect(instance.state).toEqual({ hasError: false });
  });

  it("getDerivedStateFromError always returns hasError: true", () => {
    expect(CompanionErrorBoundary.getDerivedStateFromError()).toEqual({ hasError: true });
  });

  it("componentDidCatch logs the error via console.error with the expected prefix", () => {
    const instance = new CompanionErrorBoundary({ children: "child" });
    const error = new Error("boom");

    instance.componentDidCatch(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Companion render error (isolated, page unaffected):",
      error
    );
  });

  it("render() returns the children when hasError is false", () => {
    const instance = new CompanionErrorBoundary({ children: "PROTECTED" });
    expect(instance.render()).toBe("PROTECTED");
  });

  it("render() returns null once state has been updated to hasError: true (post-catch)", () => {
    const instance = new CompanionErrorBoundary({ children: "PROTECTED" });

    // Simulate what React does after catching: merge getDerivedStateFromError's
    // result into state, then re-render the same instance.
    instance.state = { ...instance.state, ...CompanionErrorBoundary.getDerivedStateFromError() };

    expect(instance.render()).toBeNull();
  });

  it("full lifecycle: derive next state + componentDidCatch + re-render yields null and one log", () => {
    const instance = new CompanionErrorBoundary({ children: <span>SHOULD_NOT_APPEAR</span> });
    const error = new Error("companion crashed");

    const nextState = CompanionErrorBoundary.getDerivedStateFromError();
    instance.state = { ...instance.state, ...nextState };
    instance.componentDidCatch(error);

    expect(instance.render()).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Companion render error (isolated, page unaffected):",
      error
    );
  });
});
