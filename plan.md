# AuraStyle — Wave Program Contributor Plan

AuraStyle participates in the **Drips Wave Program**, where open-source contributors earn rewards by completing scoped issues during sprint cycles. This document explains how the program works and what kinds of work are available.

---

## How the Wave Program Works

Maintainers open **scoped issues** at the start of each two-week sprint. Each issue is tagged with a type, a difficulty level, and a point value. Contributors pick up issues, submit pull requests, and earn points upon merge. At the end of the sprint (the "Wave"), the top contributors share a reward pool funded by ecosystem partners.

**Sprint cycle:** 2 weeks  
**Reward pool:** Announced at the start of each Wave in the `#wave-announcements` channel  
**Point-to-reward ratio:** Pro-rata — your share = your points / total points earned that Wave

---

## Issue Types We Post

### 🐛 Bug Fixes
Broken contract logic, UI crashes, incorrect AI price mappings, or failed Soroban transactions. These are the highest-priority issues and are always available.

*Examples:*
- `refund()` does not revert when booking is already completed
- BookingForm crashes when wallet is disconnected mid-flow
- USDC amount conversion off by one decimal place

### ✨ New Features
Additions that extend the protocol — new contract entry points, new AI style categories, or new frontend flows.

*Examples:*
- Add a `dispute()` entry point that freezes funds pending arbitration
- Support tipping: allow customer to send an optional tip on `complete_service`
- Add a "Stylist Profile" page that reads on-chain booking history

### 📝 Documentation
Improving the README, writing inline code comments, creating tutorials, or translating docs.

*Examples:*
- Write a step-by-step testnet deployment guide
- Add JSDoc comments to all exported functions in `ai_logic.js`
- Translate README to Spanish or French

### 🧪 Testing
Writing unit tests for the Soroban contract using `soroban-sdk testutils`, or integration tests for the AI and frontend layers.

*Examples:*
- Unit test `book_style` with a mock token contract
- Test that `complete_service` fails when called by a non-customer address
- Jest test for `getHairRecommendation` with a mocked axios response

### ⚡ Performance & Security
Gas optimisation in the contract, input validation hardening, or dependency audits.

*Examples:*
- Replace `instance` storage with `persistent` storage for long-lived bookings
- Add amount upper-bound check to prevent overflow
- Audit npm dependencies for known CVEs

---

## How to Contribute

1. Browse open issues labelled `wave-ready` on GitHub.
2. Comment "I'm picking this up" to claim the issue.
3. Fork the repo, create a branch named `wave/<issue-number>-short-description`.
4. Submit a PR referencing the issue number. Include a short test or proof of fix.
5. A maintainer reviews within 48 hours. Merged PRs earn the listed points immediately.

---

## Point Values

| Difficulty | Points |
|---|---|
| Good First Issue | 10 |
| Medium | 25 |
| Hard | 50 |
| Critical Bug | 75 |

Bonus multipliers apply for AI-verified quality (clean code, full test coverage, clear PR description): **+10%**.

---

## Code of Conduct

Be respectful, write clear commit messages, and keep PRs focused on one issue. Maintainers reserve the right to reassign stale claims (no activity for 5 days).
