import { useState, useEffect, useRef } from "react";
import { Dices, X, RotateCcw, Plus, Minus } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const DICE = [4, 6, 8, 10, 12, 20, 100];
const DICE_COLORS = {
  4: "hsl(200 90% 55%)",
  6: "hsl(265 85% 62%)",
  8: "hsl(290 80% 60%)",
  10: "hsl(340 80% 60%)",
  12: "hsl(45 90% 55%)",
  20: "hsl(355 80% 52%)",
  100: "hsl(170 80% 50%)"
};
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}
export function DiceRoller() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [selectedDie, setSelectedDie] = useState(20);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const [lastRoll, setLastRoll] = useState(null);
  const idCounter = useRef(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("dice-history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("dice-history", JSON.stringify(history.slice(0, 30)));
    } catch {}
  }, [history]);
  function performRoll(die) {
    if (rolling) return;
    setRolling(true);
    setTimeout(() => {
      const rolls = [];
      for (let i = 0; i < count; i++) rolls.push(rollDie(die));
      const sum = rolls.reduce((a, b) => a + b, 0);
      const total = sum + modifier;
      const notation = `${count}d${die}${modifier ? modifier > 0 ? `+${modifier}` : `${modifier}` : ""}`;
      const entry = {
        id: ++idCounter.current,
        notation,
        rolls,
        total,
        modifier,
        ts: Date.now()
      };
      setLastRoll(entry);
      setHistory(h => [entry, ...h].slice(0, 30));
      setRolling(false);
    }, 550);
  }
  const isCritical = (die, val) => die === 20 && val === 20;
  const isFumble = (die, val) => die === 20 && val === 1;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs("button", {
      onClick: () => setOpen(v => !v),
      className: "fixed bottom-6 right-6 z-50 group print:hidden",
      "aria-label": "Abrir rolador de dados",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 rounded-full bg-primary/30 blur-xl group-hover:bg-primary/50 transition-all animate-pulse"
      }), /*#__PURE__*/_jsx("div", {
        className: "relative h-14 w-14 rounded-full bg-gradient-to-br from-primary via-purple-700 to-primary border-2 border-primary/70 flex items-center justify-center shadow-[0_0_25px_hsl(265_85%_62%_/_0.6)] group-hover:shadow-[0_0_40px_hsl(265_85%_62%_/_0.9)] group-hover:scale-105 transition-all",
        children: open ? /*#__PURE__*/_jsx(X, {
          className: "h-6 w-6 text-white"
        }) : /*#__PURE__*/_jsx(Dices, {
          className: "h-6 w-6 text-white group-hover:rotate-12 transition-transform"
        })
      })]
    }), open && /*#__PURE__*/_jsxs("div", {
      className: "fixed bottom-24 right-6 z-50 w-[340px] glass-strong rounded-xl border border-primary/40 shadow-2xl shadow-primary/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 print:hidden",
      children: [/*#__PURE__*/_jsx("div", {
        className: "relative px-4 py-3 border-b border-primary/20 bg-gradient-to-r from-primary/15 to-transparent",
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(Dices, {
            className: "h-4 w-4 text-primary"
          }), /*#__PURE__*/_jsx("span", {
            className: "font-display tracking-wider text-sm",
            children: "DADOS AMALDI\xC7OADOS"
          }), /*#__PURE__*/_jsx("span", {
            className: "font-jp text-[10px] tracking-widest text-primary/60 ml-auto",
            children: "\u9AB0\u5B50"
          })]
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "px-4 pt-4 pb-3",
        children: /*#__PURE__*/_jsx("div", {
          className: `relative h-28 rounded-lg border flex flex-col items-center justify-center overflow-hidden transition-all ${rolling ? "border-primary animate-pulse" : "border-border/50"}`,
          style: {
            background: lastRoll ? `radial-gradient(circle at center, ${DICE_COLORS[selectedDie]}33, transparent 70%)` : "rgba(20,15,30,0.4)"
          },
          children: rolling ? /*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx(Dices, {
              className: "h-10 w-10 text-primary mx-auto animate-spin",
              style: {
                animationDuration: "0.4s"
              }
            }), /*#__PURE__*/_jsx("div", {
              className: "font-jp text-[11px] tracking-[0.3em] text-primary/70 mt-1",
              children: "\u6295\u64F2\u4E2D\u2026"
            })]
          }) : lastRoll ? /*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx("div", {
              className: "font-display text-5xl font-bold leading-none",
              style: {
                color: DICE_COLORS[selectedDie],
                textShadow: `0 0 20px ${DICE_COLORS[selectedDie]}88`
              },
              children: lastRoll.total
            }), /*#__PURE__*/_jsx("div", {
              className: "text-[10px] uppercase tracking-widest text-muted-foreground mt-1",
              children: lastRoll.notation
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex gap-1 mt-1.5 justify-center flex-wrap",
              children: [lastRoll.rolls.map((r, i) => /*#__PURE__*/_jsx("span", {
                className: `text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${isCritical(selectedDie, r) ? "border-yellow-400 bg-yellow-400/20 text-yellow-300" : isFumble(selectedDie, r) ? "border-red-500 bg-red-500/20 text-red-400" : "border-border/40 bg-card/60 text-muted-foreground"}`,
                children: r
              }, i)), lastRoll.modifier !== 0 && /*#__PURE__*/_jsx("span", {
                className: "text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border border-primary/40 bg-primary/10 text-primary",
                children: lastRoll.modifier > 0 ? `+${lastRoll.modifier}` : lastRoll.modifier
              })]
            })]
          }) : /*#__PURE__*/_jsxs("div", {
            className: "text-center",
            children: [/*#__PURE__*/_jsx("div", {
              className: "font-jp text-2xl text-muted-foreground/40",
              children: "\u8853"
            }), /*#__PURE__*/_jsx("div", {
              className: "text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-1",
              children: "Role um dado"
            })]
          })
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-4 pb-3 flex items-center gap-2 text-xs",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-1 bg-card/40 rounded border border-border/40 px-2 py-1",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-[10px] uppercase tracking-wider text-muted-foreground mr-1",
            children: "Qtd"
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setCount(c => Math.max(1, c - 1)),
            className: "h-4 w-4 flex items-center justify-center hover:text-primary",
            children: /*#__PURE__*/_jsx(Minus, {
              className: "h-3 w-3"
            })
          }), /*#__PURE__*/_jsx("span", {
            className: "font-mono font-bold w-5 text-center",
            children: count
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setCount(c => Math.min(20, c + 1)),
            className: "h-4 w-4 flex items-center justify-center hover:text-primary",
            children: /*#__PURE__*/_jsx(Plus, {
              className: "h-3 w-3"
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-1 bg-card/40 rounded border border-border/40 px-2 py-1",
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-[10px] uppercase tracking-wider text-muted-foreground mr-1",
            children: "Mod"
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setModifier(m => m - 1),
            className: "h-4 w-4 flex items-center justify-center hover:text-primary",
            children: /*#__PURE__*/_jsx(Minus, {
              className: "h-3 w-3"
            })
          }), /*#__PURE__*/_jsx("span", {
            className: "font-mono font-bold w-7 text-center",
            children: modifier >= 0 ? `+${modifier}` : modifier
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setModifier(m => m + 1),
            className: "h-4 w-4 flex items-center justify-center hover:text-primary",
            children: /*#__PURE__*/_jsx(Plus, {
              className: "h-3 w-3"
            })
          })]
        }), /*#__PURE__*/_jsx("button", {
          onClick: () => {
            setModifier(0);
            setCount(1);
          },
          className: "ml-auto text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground",
          children: "Reset"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "px-4 pb-4 grid grid-cols-4 gap-2",
        children: [DICE.map(d => /*#__PURE__*/_jsxs("button", {
          onClick: () => {
            setSelectedDie(d);
            performRoll(d);
          },
          disabled: rolling,
          className: `group/d relative aspect-square rounded-lg border font-display font-bold flex items-center justify-center transition-all overflow-hidden ${selectedDie === d ? "border-primary/70 shadow-[0_0_15px_hsl(265_85%_62%_/_0.4)]" : "border-border/40 hover:border-primary/40"} disabled:opacity-50`,
          style: {
            background: `linear-gradient(135deg, ${DICE_COLORS[d]}22, transparent 60%)`,
            color: DICE_COLORS[d]
          },
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute inset-0 opacity-0 group-hover/d:opacity-100 transition-opacity",
            style: {
              background: `radial-gradient(circle, ${DICE_COLORS[d]}33, transparent 70%)`
            }
          }), /*#__PURE__*/_jsxs("span", {
            className: "relative text-sm",
            children: ["d", d]
          })]
        }, d)), /*#__PURE__*/_jsx("button", {
          onClick: () => setHistory([]),
          className: "aspect-square rounded-lg border border-border/40 text-muted-foreground hover:text-destructive hover:border-destructive/40 flex items-center justify-center",
          title: "Limpar hist\xF3rico",
          children: /*#__PURE__*/_jsx(RotateCcw, {
            className: "h-4 w-4"
          })
        })]
      }), history.length > 0 && /*#__PURE__*/_jsxs("div", {
        className: "border-t border-border/30 max-h-40 overflow-y-auto",
        children: [/*#__PURE__*/_jsx("div", {
          className: "px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground bg-card/30 sticky top-0",
          children: "Hist\xF3rico"
        }), /*#__PURE__*/_jsx("div", {
          className: "px-3 py-1 space-y-0.5",
          children: history.slice(0, 10).map(h => /*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between px-2 py-1 text-xs rounded hover:bg-card/40",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-mono text-muted-foreground",
              children: h.notation
            }), /*#__PURE__*/_jsxs("span", {
              className: "font-mono",
              children: [h.rolls.join("+"), h.modifier !== 0 && (h.modifier > 0 ? `+${h.modifier}` : h.modifier)]
            }), /*#__PURE__*/_jsx("span", {
              className: "font-display font-bold text-primary",
              children: h.total
            })]
          }, h.id))
        })]
      })]
    })]
  });
}
export default DiceRoller;
