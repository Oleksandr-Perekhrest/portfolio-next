// outsource dependencies
import "@testing-library/jest-dom/jest-globals";

// jsdom does not implement ResizeObserver; provide a minimal stub for Radix primitives
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

window.ResizeObserver = ResizeObserverStub;
