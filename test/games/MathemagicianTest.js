const Mathemagician = require("../../src/games/Mathemagician");

describe("Mathemagician", () => {
  const emptyGame = new Mathemagician({
    id: "id",
    expressions: [],
    startTime: Date.now(),
  });

  const gameWithRounds = (rounds) => {
    const expressions = Array.from({ length: rounds }).map(() =>
      Mathemagician.generateExpression()
    );
    return new Mathemagician({
      id: "id",
      expressions: expressions,
      startTime: Date.now(),
    });
  };

  it("has ID and type", () => {
    expect(emptyGame.present()).to.include({
      id: "id",
      type: "mathemagician",
    });
  });

  it("is finished when no expressions", () => {
    expect(emptyGame.present()).to.include({
      nextExpression: null,
      skipsRemaining: 0,
      status: "finished",
    });
  });

  it("can be skipped once per three expressions", () => {
    const game = gameWithRounds(6);
    expect(game.move({ move: "skip" })).to.have.nested.include({
      "move.skipped": true,
      "game.skipsRemaining": 1,
    });
    expect(game.move({ move: "skip" })).to.have.nested.include({
      "move.skipped": true,
      "game.skipsRemaining": 0,
    });

    // Can no longer skip
    const nextExpression = game.present().nextExpression;
    expect(game.move({ move: "skip" })).to.have.deep.nested.property(
      "game.nextExpression",
      nextExpression
    );
  });

  it("can be played to completion", () => {
    const expressions = [
      Mathemagician.evaluateExpression({ lhs: 1, rhs: 1, operator: "+" }),
      Mathemagician.evaluateExpression({ lhs: 1, rhs: 1, operator: "*" }),
      Mathemagician.evaluateExpression({ lhs: 1, rhs: 1, operator: "-" }),
      Mathemagician.evaluateExpression({ lhs: 10, rhs: 3, operator: "/" }),
    ];
    const game = new Mathemagician({
      id: "id",
      expressions: expressions,
      startTime: Date.now(),
    });

    expect(game.move({ move: "2" })).to.nested.include({
      "move.correct": true,
      "game.status": "waiting_for_move",
    });
    expect(game.move({ move: "1" })).to.have.nested.property(
      "move.correct",
      true
    );
    expect(game.move({ move: "1" })).to.have.nested.property(
      "move.correct",
      false
    );
    expect(game.move({ move: "3" })).to.nested.include({
      "move.correct": true,
      "game.status": "finished",
    });
  });
});
