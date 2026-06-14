import { useState } from "react";
import { useListShikigamis, useCreateShikigami, useDeleteShikigami, getListShikigamisQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Cat, Heart, Zap, Sparkles } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const TYPES = ["Comum", "Especial", "Herdado", "Personalizado"];
const RANKS = ["E", "D", "C", "B", "A", "S", "Especial"];
const RANK_COLOR = {
  E: "hsl(0 0% 50%)",
  D: "hsl(200 60% 55%)",
  C: "hsl(160 60% 50%)",
  B: "hsl(45 80% 55%)",
  A: "hsl(20 85% 55%)",
  S: "hsl(355 80% 52%)",
  Especial: "hsl(265 85% 62%)"
};
export default function ShikigamisPage() {
  const {
    data,
    isLoading
  } = useListShikigamis();
  const qc = useQueryClient();
  const {
    toast
  } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    appearance: "",
    type: "Comum",
    rank: "C",
    hp: 10,
    energy: 10,
    abilities: "",
    techniques: "",
    relationship: ""
  });
  const {
    mutate: create,
    isPending: creating
  } = useCreateShikigami({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Shikigami invocado."
        });
        qc.invalidateQueries({
          queryKey: getListShikigamisQueryKey()
        });
        setOpen(false);
        setForm({
          name: "",
          appearance: "",
          type: "Comum",
          rank: "C",
          hp: 10,
          energy: 10,
          abilities: "",
          techniques: "",
          relationship: ""
        });
      },
      onError: () => toast({
        title: "Erro ao criar shikigami",
        variant: "destructive"
      })
    }
  });
  const {
    mutate: remove
  } = useDeleteShikigami({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Shikigami dispersado."
        });
        qc.invalidateQueries({
          queryKey: getListShikigamisQueryKey()
        });
      }
    }
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-8",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex flex-col md:flex-row md:items-end md:justify-between gap-4",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 mb-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "font-jp text-xs tracking-[0.4em] text-primary/70",
            children: "\u5F0F\u795E"
          }), /*#__PURE__*/_jsx("span", {
            className: "h-px w-12 bg-primary/30"
          })]
        }), /*#__PURE__*/_jsx("h1", {
          className: "font-display text-3xl md:text-4xl font-bold tracking-wider text-cursed",
          children: "SHIKIGAMIS"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground mt-2 text-sm max-w-xl",
          children: "Invoca\xE7\xF5es vinculadas ao usu\xE1rio. Criaturas de energia amaldi\xE7oada que servem ao feiticeiro atrav\xE9s de pactos e t\xE9cnicas herdadas."
        })]
      }), /*#__PURE__*/_jsxs(Dialog, {
        open: open,
        onOpenChange: setOpen,
        children: [/*#__PURE__*/_jsx(DialogTrigger, {
          asChild: true,
          children: /*#__PURE__*/_jsxs(Button, {
            className: "gap-2 bg-gradient-to-r from-primary to-purple-700 hover:to-purple-600 border border-primary/50 shadow-[0_0_20px_hsl(265_85%_62%_/_0.4)] font-display tracking-wider",
            children: [/*#__PURE__*/_jsx(Plus, {
              className: "h-4 w-4"
            }), " Invocar Shikigami"]
          })
        }), /*#__PURE__*/_jsxs(DialogContent, {
          className: "glass-strong border-primary/30 max-w-lg",
          children: [/*#__PURE__*/_jsx(DialogHeader, {
            children: /*#__PURE__*/_jsx(DialogTitle, {
              className: "font-display tracking-wider text-cursed",
              children: "NOVA INVOCA\xC7\xC3O"
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid gap-3 mt-2",
            children: [/*#__PURE__*/_jsx(Field, {
              label: "Nome",
              children: /*#__PURE__*/_jsx(Input, {
                value: form.name,
                onChange: e => setForm({
                  ...form,
                  name: e.target.value
                }),
                placeholder: "Ex: Mahoraga, Nue, Sapo Gigante...",
                className: "bg-background/60"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-3",
              children: [/*#__PURE__*/_jsx(Field, {
                label: "Tipo",
                children: /*#__PURE__*/_jsxs(Select, {
                  value: form.type,
                  onValueChange: v => setForm({
                    ...form,
                    type: v
                  }),
                  children: [/*#__PURE__*/_jsx(SelectTrigger, {
                    className: "bg-background/60",
                    children: /*#__PURE__*/_jsx(SelectValue, {})
                  }), /*#__PURE__*/_jsx(SelectContent, {
                    children: TYPES.map(t => /*#__PURE__*/_jsx(SelectItem, {
                      value: t,
                      children: t
                    }, t))
                  })]
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Grau",
                children: /*#__PURE__*/_jsxs(Select, {
                  value: form.rank,
                  onValueChange: v => setForm({
                    ...form,
                    rank: v
                  }),
                  children: [/*#__PURE__*/_jsx(SelectTrigger, {
                    className: "bg-background/60",
                    children: /*#__PURE__*/_jsx(SelectValue, {})
                  }), /*#__PURE__*/_jsx(SelectContent, {
                    children: RANKS.map(r => /*#__PURE__*/_jsx(SelectItem, {
                      value: r,
                      children: r
                    }, r))
                  })]
                })
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-3",
              children: [/*#__PURE__*/_jsx(Field, {
                label: "PV",
                children: /*#__PURE__*/_jsx(Input, {
                  type: "number",
                  min: 1,
                  value: form.hp,
                  onChange: e => setForm({
                    ...form,
                    hp: Number(e.target.value)
                  }),
                  className: "bg-background/60"
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "PE",
                children: /*#__PURE__*/_jsx(Input, {
                  type: "number",
                  min: 0,
                  value: form.energy,
                  onChange: e => setForm({
                    ...form,
                    energy: Number(e.target.value)
                  }),
                  className: "bg-background/60"
                })
              })]
            }), /*#__PURE__*/_jsx(Field, {
              label: "Apar\xEAncia",
              children: /*#__PURE__*/_jsx(Textarea, {
                rows: 2,
                value: form.appearance,
                onChange: e => setForm({
                  ...form,
                  appearance: e.target.value
                }),
                placeholder: "Descreva a forma f\xEDsica da invoca\xE7\xE3o...",
                className: "bg-background/60 resize-none"
              })
            }), /*#__PURE__*/_jsx(Field, {
              label: "Habilidades",
              children: /*#__PURE__*/_jsx(Textarea, {
                rows: 2,
                value: form.abilities,
                onChange: e => setForm({
                  ...form,
                  abilities: e.target.value
                }),
                placeholder: "Adapta\xE7\xE3o, Voo, Devora\xE7\xE3o de Cad\xE1veres...",
                className: "bg-background/60 resize-none"
              })
            }), /*#__PURE__*/_jsx(Field, {
              label: "T\xE9cnicas pr\xF3prias",
              children: /*#__PURE__*/_jsx(Textarea, {
                rows: 2,
                value: form.techniques,
                onChange: e => setForm({
                  ...form,
                  techniques: e.target.value
                }),
                placeholder: "Ataques amaldi\xE7oados, golpes especiais...",
                className: "bg-background/60 resize-none"
              })
            }), /*#__PURE__*/_jsx(Field, {
              label: "V\xEDnculo com o feiticeiro",
              children: /*#__PURE__*/_jsx(Input, {
                value: form.relationship,
                onChange: e => setForm({
                  ...form,
                  relationship: e.target.value
                }),
                placeholder: "Ex: Servo eterno, pacto de sangue...",
                className: "bg-background/60"
              })
            }), /*#__PURE__*/_jsx(Button, {
              onClick: () => create({
                data: {
                  ...form,
                  appearance: form.appearance || undefined,
                  abilities: form.abilities || undefined,
                  techniques: form.techniques || undefined,
                  relationship: form.relationship || undefined
                }
              }),
              disabled: creating || !form.name,
              className: "bg-primary hover:bg-primary/90 mt-2 font-display tracking-wider",
              children: creating ? "Invocando..." : "Selar Invocação"
            })]
          })]
        })]
      })]
    }), isLoading ? /*#__PURE__*/_jsx("div", {
      className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
      children: [1, 2, 3].map(i => /*#__PURE__*/_jsx(Skeleton, {
        className: "h-64 rounded-xl"
      }, i))
    }) : data && data.length > 0 ? /*#__PURE__*/_jsx("div", {
      className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
      children: data.map(s => {
        const color = RANK_COLOR[s.rank] ?? "hsl(265 85% 62%)";
        return /*#__PURE__*/_jsxs("div", {
          className: "group relative glass rounded-xl p-5 hover-lift overflow-hidden",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity",
            style: {
              background: `radial-gradient(circle, ${color}, transparent 70%)`
            }
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-start justify-between mb-3",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-3",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "h-11 w-11 rounded-lg border flex items-center justify-center",
                  style: {
                    background: `linear-gradient(135deg, ${color}33, transparent)`,
                    borderColor: `${color}55`,
                    color
                  },
                  children: /*#__PURE__*/_jsx(Cat, {
                    className: "h-5 w-5"
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("h3", {
                    className: "font-display tracking-wide",
                    children: s.name
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-[10px] uppercase tracking-widest text-muted-foreground",
                    children: s.type
                  })]
                })]
              }), /*#__PURE__*/_jsx("span", {
                className: "text-[10px] font-bold px-2 py-1 rounded border font-display tracking-widest",
                style: {
                  color,
                  borderColor: `${color}66`,
                  background: `${color}11`
                },
                children: s.rank
              })]
            }), s.appearance && /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-muted-foreground italic mb-3 line-clamp-2",
              children: ["\"", s.appearance, "\""]
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-2 mb-3 text-xs",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 px-2 py-1 rounded border border-destructive/30 bg-destructive/5",
                children: [/*#__PURE__*/_jsx(Heart, {
                  className: "h-3 w-3 text-destructive"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-muted-foreground",
                  children: "PV"
                }), /*#__PURE__*/_jsx("strong", {
                  className: "ml-auto text-destructive",
                  children: s.hp
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 px-2 py-1 rounded border border-primary/30 bg-primary/5",
                children: [/*#__PURE__*/_jsx(Zap, {
                  className: "h-3 w-3 text-primary"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-muted-foreground",
                  children: "PE"
                }), /*#__PURE__*/_jsx("strong", {
                  className: "ml-auto text-primary",
                  children: s.energy
                })]
              })]
            }), s.abilities && /*#__PURE__*/_jsxs("div", {
              className: "mb-2",
              children: [/*#__PURE__*/_jsxs("p", {
                className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1",
                children: [/*#__PURE__*/_jsx(Sparkles, {
                  className: "h-2.5 w-2.5 text-primary"
                }), " Habilidades"]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs line-clamp-2",
                children: s.abilities
              })]
            }), s.techniques && /*#__PURE__*/_jsxs("div", {
              className: "mb-3",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1",
                children: "T\xE9cnicas"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs line-clamp-2",
                children: s.techniques
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between pt-2 border-t border-border/30",
              children: [s.relationship ? /*#__PURE__*/_jsx("span", {
                className: "text-[10px] text-muted-foreground italic truncate",
                children: s.relationship
              }) : /*#__PURE__*/_jsx("span", {}), /*#__PURE__*/_jsx("button", {
                onClick: () => remove({
                  id: s.id
                }),
                className: "ml-auto text-muted-foreground hover:text-destructive transition-colors",
                title: "Dispersar",
                children: /*#__PURE__*/_jsx(Trash2, {
                  className: "h-3.5 w-3.5"
                })
              })]
            })]
          })]
        }, s.id);
      })
    }) : /*#__PURE__*/_jsxs("div", {
      className: "glass rounded-xl p-12 text-center",
      children: [/*#__PURE__*/_jsx(Cat, {
        className: "h-12 w-12 text-primary/40 mx-auto mb-4"
      }), /*#__PURE__*/_jsx("h3", {
        className: "font-display tracking-wider text-lg",
        children: "Nenhum shikigami invocado"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-muted-foreground mt-2",
        children: "Sele seu primeiro pacto com uma criatura amaldi\xE7oada."
      })]
    })]
  });
}
function Field({
  label,
  children
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-1.5",
    children: [/*#__PURE__*/_jsx(Label, {
      className: "text-xs uppercase tracking-wider text-muted-foreground",
      children: label
    }), children]
  });
}
