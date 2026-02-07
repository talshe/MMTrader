# MMTrader Subagents

This project uses specialized Cursor subagents to handle different aspects of the algorithmic trading system lifecycle.

## 1. Architect (`architect`)
**Goal:** Plan & Design.
**Focus:** High-level system design, service boundaries, data flows, and project roadmap.
**Use for:**
- Drafting detailed technical specs and roadmaps.
- Designing API contracts between `trader` (Node) and `py-runner` (Python).
- Planning database schema evolution and service scalability.
- Analyzing cross-cutting concerns like latency and reliability.

## 2. Platform Developer (`platform-dev`)
**Goal:** Develop Infrastructure & UI.
**Focus:** The trading engine (`apps/trader`) and dashboard (`apps/web`).
**Use for:**
- Implementing exchange adapters and order management logic.
- Building the real-time React dashboard and controls.
- Managing database migrations and API endpoints.
- Optimizing "plumbing" tasks like WebSocket handling and state management.

## 3. Quant Developer (`quant-dev`)
**Goal:** Develop Logic & Research.
**Focus:** Quantitative research, Python compute (`apps/py-runner`), and strategy logic.
**Use for:**
- Implementing and vectorizing strategy logic (signals, indicators).
- Building and optimizing the Python backtest engine.
- Analyzing large datasets and modeling slippage/fees.
- Defining Pydantic models and data validation rules.

## 4. Verifier (`verifier`)
**Goal:** Review, Test & Secure.
**Focus:** Code review, risk management, and quality assurance.
**Use for:**
- Conducting independent code reviews and security checks.
- Verifying risk controls (kill-switches, max drawdown limits).
- Ensuring backward compatibility and regression testing.
- Analyzing edge cases in execution logic and strategy behavior.
