**Project Concept:**
A web app for calculating scores for a custom version of Doppelkopf. Intended as a **single-device, shared-screen companion** during live play.

---

### Tech Stack & Styling

* **Language/Framework:** TypeScript + Vite + React
* **Styling:** styled-components
* **Design:** paper-like, clean, modern, very few animations

---

### Start / Entry Screen

1. Input fields for **4 player names**.
2. Color selection for each player.
3. Mode selection:

   * **Normal Spritzen Mode:** checkboxes for predefined Spritze types
   * **Custom Spritzen Mode:** input field for user-specified number of Spritzes
4. On submit: transitions to game screen.

---

### Game Screen Layout

**Left Column (small):**

* Displays **player names**, **total score**, and **position**.
* **Reset button:** opens confirmation overlay → clears local storage and refreshes.
* Optional **dark/light mode switch**.

**Middle/Right Column (large): Game Table**

* **7 columns per row:**
  - Column 1. **Round number:**
     * Hover behavior:
       * Accept button (if current round)
       * Reset button (if previous round)
     * Clicking accept finalizes current round
     * Clicking reset reverts **immediately previous round only**
  - Column 2–5. **Player points:**
     * Current round: checkbox in top-right corner to mark winner
     * 0–4 winners allowed
     * Once round accepted:
       * Winners: round points displayed, added to cumulative total
       * Non-winners: display “-”
     * Optionally, show both **total points** and **points gained that round**
  - Column 6. **Spritze column:**
     * Normal mode:
       * Active Spritzes and carried-over Spritzes displayed
       * Carried-over Spritzes (from losing player) automatically counted for 2 rounds
       * Special Spritzes included (e.g., losers below 90/60/30/0 points, winning against queens)
     * Custom mode: displays number input by user
       * Cannot be modified after round acceptance
     * Rules: Spritzes **only for current round**, **entered before acceptance**, **cannot be added to past rounds**
  - Column 7. **Only in normal mode:** checkboxes for all possible Spritzes in current round
     * Checked boxes add Spritzes to column 6

---

### Scoring Mechanics

* Base points per round: 10
* Spritz multiplier: each Spritze doubles round points (total = 10 × 2^totalSpritz)
* Multiple Spritzes stack **additively**
* 0–4 winners per round; each winner receives **full round points**
* Non-winners gain nothing
* Spritze carry-over automatically applied for losing player for 2 rounds
* Spritze types **hardcoded**; stretch goal: pre-game configuration

---

### Round Flow

1. **Start of round:** new row added with incremented round number
2. **Mark winners:** 0–4 checkboxes
3. **Enter Spritzes:**
   * Normal mode: check relevant Spritze checkboxes
   * Custom mode: input total number of Spritzes
4. **Accept round:**
   * Calculate points for winners
   * Apply Spritze multipliers
   * Apply carry-over effects
   * Update total scores in left column
5. **Undo previous round:**
   * Hover previous round number → reset button
   * Clicking reverts **exactly last round**
   * Remove Spritze carry-overs from that round
   * Recalculate scores
6. **Repeat** for subsequent rounds

---

### Game Duration & Persistence

* **Unbounded duration**: no automatic end
* Single ongoing game stored locally
* Reset button clears the game
* Multiple game saves / history are stretch goals

---

### Key Rules & Assumptions

* Single-device, shared-screen use
* No multi-user interaction
* Zero-winner rounds are valid
* Spritzes always entered **before acceptance**
* Past rounds cannot be modified
* Undo is limited to **last round only**
* Spritze carry-over enforced automatically
