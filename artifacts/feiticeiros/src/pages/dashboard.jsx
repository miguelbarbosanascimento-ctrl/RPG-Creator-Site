import { useListCharacters, useGetDashboardSummary } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlusCircle, Users, Activity, TrendingUp, BookOpen, Sparkles, Flame, Eye, Heart, Zap, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Dashboard() {
  const {
    data: summary,
    isLoading: isSummaryLoading
  } = useGetDashboardSummary();
  const {
    data: characters,
    isLoading: isCharactersLoading
  } = useListCharacters();
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-10",
    children: [/*#__PURE__*/_jsxs("section", {
      className: "relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-background via-primary/[0.06] to-background p-6 md:p-10",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "absolute inset-0 pointer-events-none",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-50",
          style: {
            background: "radial-gradient(circle, hsl(265 85% 50% / 0.45), transparent 70%)"
          }
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute -bottom-32 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40",
          style: {
            background: "radial-gradient(circle, hsl(355 80% 45% / 0.35), transparent 70%)"
          }
        }), /*#__PURE__*/_jsx("div", {
          "aria-hidden": true,
          className: "absolute inset-y-0 right-4 md:right-12 flex items-center select-none font-jp font-black leading-none text-[22vw] md:text-[14vw] opacity-[0.05]",
          style: {
            color: "hsl(265 85% 70%)"
          },
          children: "\u8853"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute inset-x-0 h-px",
          style: {
            top: "30%",
            background: "linear-gradient(90deg, transparent, hsl(265 100% 70% / 0.4), transparent)"
          }
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "space-y-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-jp text-xs tracking-[0.5em] text-primary/80",
              children: "\u8853\u5E2B\u540D\u7C3F"
            }), /*#__PURE__*/_jsx("span", {
              className: "h-px w-12 bg-gradient-to-r from-primary/60 to-transparent"
            }), /*#__PURE__*/_jsx(Eye, {
              className: "h-3 w-3 text-primary/70"
            })]
          }), /*#__PURE__*/_jsx("h1", {
            className: "font-display text-3xl md:text-5xl font-bold tracking-wider text-cursed animate-title-flicker",
            children: "CENTRAL DO NARRADOR"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-muted-foreground text-sm md:text-base max-w-xl",
            children: "Vis\xE3o geral das maldi\xE7\xF5es e feiticeiros sob seu dom\xEDnio. Vigie a energia. Comande a sala."
          })]
        }), /*#__PURE__*/_jsx(Link, {
          href: "/fichas/nova",
          children: /*#__PURE__*/_jsxs("span", {
            className: "group relative inline-flex items-center gap-2 h-12 px-7 rounded-md font-display tracking-wider text-white cursor-pointer bg-gradient-to-r from-primary via-purple-600 to-destructive border border-primary/60 shadow-[0_0_28px_hsl(265_85%_62%_/_0.5),inset_0_0_18px_hsl(265_85%_62%_/_0.3)] hover:shadow-[0_0_44px_hsl(265_85%_62%_/_0.85),inset_0_0_24px_hsl(355_80%_52%_/_0.35)] transition-all duration-300 overflow-hidden",
            children: [/*#__PURE__*/_jsx("span", {
              className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.25)_50%,transparent_60%)] bg-[length:200%_100%] group-hover:bg-[position:-100%_0] duration-700"
            }), /*#__PURE__*/_jsx(PlusCircle, {
              className: "relative h-5 w-5"
            }), /*#__PURE__*/_jsx("span", {
              className: "relative",
              children: "Forjar Feiticeiro"
            })]
          })
        })]
      })]
    }), /*#__PURE__*/_jsxs("section", {
      className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
      children: [/*#__PURE__*/_jsx(StatCard, {
        icon: /*#__PURE__*/_jsx(Users, {
          className: "h-5 w-5"
        }),
        title: "Total de Fichas",
        jp: "\u6570",
        value: summary?.totalCharacters ?? 0,
        loading: isSummaryLoading,
        accent: "violet"
      }), /*#__PURE__*/_jsx(StatCard, {
        icon: /*#__PURE__*/_jsx(BookOpen, {
          className: "h-5 w-5"
        }),
        title: "T\xE9cnicas Registradas",
        jp: "\u8853",
        value: summary?.totalTechniques ?? 0,
        loading: isSummaryLoading,
        accent: "cyan"
      }), /*#__PURE__*/_jsx(StatCard, {
        icon: /*#__PURE__*/_jsx(Activity, {
          className: "h-5 w-5"
        }),
        title: "N\xEDvel M\xE9dio",
        jp: "\u5E73\u5747",
        value: summary?.averageLevel?.toFixed(1) ?? "0.0",
        loading: isSummaryLoading,
        accent: "violet"
      }), /*#__PURE__*/_jsx(StatCard, {
        icon: /*#__PURE__*/_jsx(TrendingUp, {
          className: "h-5 w-5"
        }),
        title: "N\xEDvel M\xE1ximo",
        jp: "\u6700\u5927",
        value: summary?.highestLevel ?? 0,
        loading: isSummaryLoading,
        accent: "red"
      })]
    }), /*#__PURE__*/_jsxs("section", {
      className: "space-y-5",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between gap-3 border-b border-primary/15 pb-3",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx(Flame, {
            className: "h-5 w-5 text-primary animate-pulse"
          }), /*#__PURE__*/_jsx("h2", {
            className: "font-display text-xl md:text-2xl tracking-wider",
            children: "FICHAS ATIVAS"
          }), /*#__PURE__*/_jsx("span", {
            className: "font-jp text-xs tracking-[0.4em] text-muted-foreground/50 hidden md:inline",
            children: "\u6D3B\u52D5\u4E2D"
          })]
        }), characters && characters.length > 0 && /*#__PURE__*/_jsxs("span", {
          className: "text-xs text-muted-foreground tabular-nums",
          children: [characters.length, " ", characters.length === 1 ? "feiticeiro" : "feiticeiros"]
        })]
      }), isCharactersLoading ? /*#__PURE__*/_jsx("div", {
        className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        children: [1, 2, 3].map(i => /*#__PURE__*/_jsxs("div", {
          className: "glass rounded-xl p-5",
          children: [/*#__PURE__*/_jsx(Skeleton, {
            className: "h-5 w-3/4 mb-2"
          }), /*#__PURE__*/_jsx(Skeleton, {
            className: "h-4 w-1/2 mb-4"
          }), /*#__PURE__*/_jsx(Skeleton, {
            className: "h-2 w-full mb-2"
          }), /*#__PURE__*/_jsx(Skeleton, {
            className: "h-2 w-full"
          })]
        }, i))
      }) : characters && characters.length > 0 ? /*#__PURE__*/_jsx("div", {
        className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
        children: characters.map(char => /*#__PURE__*/_jsx(CharacterPosterCard, {
          char: char
        }, char.id))
      }) : /*#__PURE__*/_jsxs("div", {
        className: "relative glass rounded-xl p-10 text-center overflow-hidden",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-destructive/5 pointer-events-none"
        }), /*#__PURE__*/_jsx("div", {
          "aria-hidden": true,
          className: "absolute inset-0 flex items-center justify-center select-none font-jp font-black leading-none text-[12rem] opacity-[0.04]",
          style: {
            color: "hsl(265 85% 70%)"
          },
          children: "\u7A7A"
        }), /*#__PURE__*/_jsxs("div", {
          className: "relative",
          children: [/*#__PURE__*/_jsx("div", {
            className: "mx-auto mb-4 h-16 w-16 rounded-full border-2 border-primary/40 flex items-center justify-center bg-primary/5 animate-pulse-glow",
            children: /*#__PURE__*/_jsx(Sparkles, {
              className: "h-7 w-7 text-primary"
            })
          }), /*#__PURE__*/_jsx("h3", {
            className: "font-display tracking-wider text-lg",
            children: "Nenhum feiticeiro encontrado... ainda."
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-muted-foreground max-w-sm mx-auto mt-2 mb-6",
            children: "A energia amaldi\xE7oada est\xE1 calma. Forje sua primeira ficha e comece a campanha."
          }), /*#__PURE__*/_jsx(Link, {
            href: "/fichas/nova",
            children: /*#__PURE__*/_jsxs(Button, {
              className: "gap-2 bg-primary hover:bg-primary/90 glow-violet-sm font-display tracking-wider px-6",
              children: [/*#__PURE__*/_jsx(PlusCircle, {
                className: "h-4 w-4"
              }), " Criar Personagem"]
            })
          })]
        })]
      })]
    })]
  });
}
function CharacterPosterCard({
  char
}) {
  const initial = char.name.charAt(0).toUpperCase();
  const hp = char.hp ?? 0;
  const maxHp = char.maxHp || 1;
  const energy = char.energy ?? 0;
  const maxEnergy = char.maxEnergy || 1;
  const hpPct = Math.min(100, hp / maxHp * 100);
  const enPct = Math.min(100, energy / maxEnergy * 100);
  const hpOver = hp > maxHp;
  const enOver = energy > maxEnergy;
  return /*#__PURE__*/_jsx(Link, {
    href: `/fichas/${char.id}`,
    className: "block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    children: /*#__PURE__*/_jsxs("article", {
      className: "group relative h-full rounded-xl overflow-hidden border border-border/40 hover:border-primary/60 group-focus-visible:border-primary/80 transition-all duration-500 cursor-pointer bg-gradient-to-b from-background/90 to-background hover:shadow-[0_0_40px_hsl(265_85%_50%_/_0.35)]",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-primary/25 via-background to-destructive/20",
        children: [char.photoUrl ? /*#__PURE__*/_jsx("img", {
          src: char.photoUrl,
          alt: char.name,
          className: "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110",
          loading: "lazy"
        }) : /*#__PURE__*/_jsxs("div", {
          className: "absolute inset-0 flex items-center justify-center",
          children: [/*#__PURE__*/_jsx("span", {
            className: "font-display font-black text-[12rem] leading-none text-transparent bg-clip-text",
            style: {
              backgroundImage: "linear-gradient(180deg, hsl(265 85% 70%) 0%, hsl(280 70% 40%) 50%, hsl(355 75% 35%) 100%)",
              filter: "drop-shadow(0 0 25px hsl(265 85% 50% / 0.4))"
            },
            children: initial
          }), /*#__PURE__*/_jsx("span", {
            "aria-hidden": true,
            className: "absolute inset-0 flex items-center justify-center font-jp font-black text-[18rem] leading-none opacity-[0.05] text-primary select-none",
            children: "\u8853"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/10 pointer-events-none"
        }), /*#__PURE__*/_jsx("div", {
          "aria-hidden": true,
          className: "absolute inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          style: {
            top: "50%",
            background: "linear-gradient(90deg, transparent, hsl(265 100% 70% / 0.7), transparent)",
            boxShadow: "0 0 12px hsl(265 100% 70% / 0.6)"
          }
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute top-3 left-3 flex items-center gap-1.5",
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 rounded-md border border-primary/40 bg-background/70 backdrop-blur-sm px-2 py-1 shadow-[0_0_12px_hsl(265_85%_50%_/_0.3)]",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-jp text-[10px] text-primary/80 tracking-widest",
              children: "\u968E\u7D1A"
            }), /*#__PURE__*/_jsx("span", {
              className: "font-display text-[11px] tracking-wider text-primary uppercase",
              children: char.grade
            })]
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute top-3 right-3",
          children: /*#__PURE__*/_jsxs("div", {
            className: "relative h-12 w-12 rounded-full border-2 border-primary/60 bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_18px_hsl(265_85%_50%_/_0.5)]",
            children: [/*#__PURE__*/_jsx("div", {
              className: "absolute inset-0 rounded-full blur-md bg-primary/40 opacity-60 group-hover:opacity-100 transition-opacity"
            }), /*#__PURE__*/_jsxs("div", {
              className: "relative text-center leading-none",
              children: [/*#__PURE__*/_jsx("div", {
                className: "font-jp text-[8px] text-primary/70 tracking-widest",
                children: "Nv"
              }), /*#__PURE__*/_jsx("div", {
                className: "font-display text-base font-bold text-white tabular-nums",
                children: char.level
              })]
            })]
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute bottom-3 right-3 font-jp text-[10px] tracking-[0.5em] text-primary/40 pointer-events-none",
          children: "\u8853\u5E2B"
        }), /*#__PURE__*/_jsxs("div", {
          className: "absolute inset-x-0 bottom-0 p-4 pt-10",
          children: [/*#__PURE__*/_jsx("h3", {
            className: "font-display tracking-wide text-lg md:text-xl font-bold text-white truncate group-hover:text-primary transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]",
            children: char.name
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mt-1 text-[10px] uppercase tracking-[0.2em] text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-primary font-semibold",
              children: char.origin
            }), /*#__PURE__*/_jsx("span", {
              className: "text-white/40",
              children: "\xB7"
            }), /*#__PURE__*/_jsx("span", {
              children: char.specialization
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative p-4 border-t border-primary/15 bg-background/60",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"
        }), /*#__PURE__*/_jsxs("div", {
          className: "space-y-2.5",
          children: [/*#__PURE__*/_jsx(PosterBar, {
            icon: /*#__PURE__*/_jsx(Heart, {
              className: "h-3 w-3"
            }),
            label: "PV",
            cur: hp,
            max: maxHp,
            pct: hpPct,
            over: hpOver,
            color: "hsl(355 80% 55%)"
          }), /*#__PURE__*/_jsx(PosterBar, {
            icon: /*#__PURE__*/_jsx(Zap, {
              className: "h-3 w-3"
            }),
            label: "PE",
            cur: energy,
            max: maxEnergy,
            pct: enPct,
            over: enOver,
            color: "hsl(265 85% 62%)"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between mt-3 pt-3 border-t border-border/30 text-[10px] tracking-wider",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1.5 text-muted-foreground",
            children: [/*#__PURE__*/_jsx(Shield, {
              className: "h-3 w-3 text-primary/60"
            }), /*#__PURE__*/_jsxs("span", {
              className: "font-mono tabular-nums text-foreground/80",
              children: ["CA ", char.armorClass ?? "—"]
            })]
          }), /*#__PURE__*/_jsx("span", {
            className: "font-jp text-primary/50 tracking-[0.3em]",
            children: "\u958B\u304F"
          })]
        })]
      })]
    })
  });
}
function PosterBar({
  icon,
  label,
  cur,
  max,
  pct,
  over,
  color
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-1",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between text-[10px]",
      children: [/*#__PURE__*/_jsxs("span", {
        className: "flex items-center gap-1 font-bold tracking-widest",
        style: {
          color
        },
        children: [icon, label]
      }), /*#__PURE__*/_jsxs("span", {
        className: `font-mono tabular-nums ${over ? "text-amber-300" : "text-muted-foreground"}`,
        children: [cur, /*#__PURE__*/_jsxs("span", {
          className: "text-muted-foreground/40",
          children: ["/", max]
        }), over && /*#__PURE__*/_jsxs("span", {
          className: "ml-1 text-amber-400",
          children: ["+", cur - max]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative h-1.5 w-full overflow-hidden rounded-full border border-border/40 bg-background/60",
      children: [/*#__PURE__*/_jsx("div", {
        className: "h-full rounded-full transition-all duration-500",
        style: {
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 10px ${color}99`
        }
      }), over && /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 rounded-full opacity-60 animate-pulse",
        style: {
          boxShadow: `inset 0 0 6px hsl(45 95% 60%)`
        }
      })]
    })]
  });
}
function StatCard({
  icon,
  title,
  jp,
  value,
  loading,
  accent
}) {
  const color = {
    violet: "hsl(265 85% 62%)",
    cyan: "hsl(200 90% 55%)",
    red: "hsl(355 80% 52%)"
  }[accent];
  return /*#__PURE__*/_jsxs("div", {
    className: "group relative glass rounded-xl p-5 hover-lift overflow-hidden border border-border/40 hover:border-primary/40 transition-all",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute -top-14 -right-14 w-36 h-36 rounded-full blur-3xl opacity-25 group-hover:opacity-70 transition-opacity duration-500",
      style: {
        background: `radial-gradient(circle, ${color}, transparent 70%)`
      }
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity",
      style: {
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`
      }
    }), /*#__PURE__*/_jsx("div", {
      "aria-hidden": true,
      className: "absolute -bottom-3 -right-1 font-jp font-black leading-none text-[5rem] opacity-[0.06] select-none pointer-events-none",
      style: {
        color
      },
      children: jp
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between mb-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "h-10 w-10 rounded-md flex items-center justify-center border group-hover:scale-110 transition-transform duration-300",
          style: {
            background: `linear-gradient(135deg, ${color}33, transparent)`,
            borderColor: `${color}55`,
            color,
            boxShadow: `0 0 18px ${color}33`
          },
          children: icon
        }), /*#__PURE__*/_jsx("span", {
          className: "font-jp text-[10px] tracking-[0.4em] text-muted-foreground/60",
          children: jp
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1.5",
        children: title
      }), loading ? /*#__PURE__*/_jsx(Skeleton, {
        className: "h-9 w-20"
      }) : /*#__PURE__*/_jsx("div", {
        className: "font-display text-4xl font-bold tabular-nums",
        style: {
          color,
          textShadow: `0 0 22px ${color}55`
        },
        children: value
      })]
    })]
  });
}
