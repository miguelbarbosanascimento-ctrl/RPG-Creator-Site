import { useState } from "react";
import { useListTechniques, useCreateTechnique } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, BookOpen, Zap } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const CATEGORIES = ["Todas", "Técnica Inata", "Técnica Herdada", "Técnica Especial", "Técnica Original"];
const CATEGORY_COLORS = {
  "Técnica Inata": "text-purple-400 border-purple-400/30 bg-purple-400/10",
  "Técnica Herdada": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "Técnica Especial": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "Técnica Original": "text-green-400 border-green-400/30 bg-green-400/10"
};
export default function Techniques() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [selected, setSelected] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const {
    toast
  } = useToast();
  const {
    data: techniques,
    isLoading,
    refetch
  } = useListTechniques(category !== "Todas" || search ? {
    search: search || undefined,
    category: category !== "Todas" ? category : undefined
  } : {});
  const {
    mutate: createTechnique,
    isPending
  } = useCreateTechnique();
  const [newTech, setNewTech] = useState({
    name: "",
    category: "Técnica Original",
    description: "",
    abilities: ""
  });
  function handleCreate() {
    if (!newTech.name.trim() || !newTech.description.trim()) {
      toast({
        title: "Preencha nome e descrição.",
        variant: "destructive"
      });
      return;
    }
    createTechnique({
      data: {
        name: newTech.name,
        category: newTech.category,
        description: newTech.description,
        abilities: newTech.abilities || undefined
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Técnica criada!",
          description: `${newTech.name} foi adicionada à biblioteca.`
        });
        setNewTech({
          name: "",
          category: "Técnica Original",
          description: "",
          abilities: ""
        });
        setOpenDialog(false);
        refetch();
      }
    });
  }
  const selectedTech = techniques?.find(t => t.id === selected);
  const abilities = (() => {
    if (!selectedTech?.abilities) return [];
    try {
      const parsed = JSON.parse(selectedTech.abilities);
      if (Array.isArray(parsed)) {
        return parsed.filter(e => e !== null && (typeof e === "string" || typeof e === "object"));
      }
      if (typeof parsed === "string" && parsed.trim()) return [parsed];
      return [];
    } catch {
      return [selectedTech.abilities];
    }
  })();
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6 animate-in fade-in duration-500",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h1", {
          className: "text-3xl font-bold tracking-tight",
          children: "Biblioteca de T\xE9cnicas"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground mt-1",
          children: "T\xE9cnicas amaldi\xE7oadas da Enciclop\xE9dia Amaldi\xE7oada e t\xE9cnicas originais."
        })]
      }), /*#__PURE__*/_jsxs(Dialog, {
        open: openDialog,
        onOpenChange: setOpenDialog,
        children: [/*#__PURE__*/_jsx(DialogTrigger, {
          asChild: true,
          children: /*#__PURE__*/_jsxs(Button, {
            className: "gap-2",
            children: [/*#__PURE__*/_jsx(Plus, {
              className: "h-4 w-4"
            }), "Nova T\xE9cnica"]
          })
        }), /*#__PURE__*/_jsxs(DialogContent, {
          className: "bg-card border-border/60 max-w-lg",
          children: [/*#__PURE__*/_jsx(DialogHeader, {
            children: /*#__PURE__*/_jsx(DialogTitle, {
              children: "Criar T\xE9cnica Original"
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "space-y-4 pt-2",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "space-y-1.5",
              children: [/*#__PURE__*/_jsx(Label, {
                children: "Nome"
              }), /*#__PURE__*/_jsx(Input, {
                value: newTech.name,
                onChange: e => setNewTech({
                  ...newTech,
                  name: e.target.value
                }),
                className: "bg-background/60",
                placeholder: "Nome da t\xE9cnica..."
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-1.5",
              children: [/*#__PURE__*/_jsx(Label, {
                children: "Categoria"
              }), /*#__PURE__*/_jsxs(Select, {
                value: newTech.category,
                onValueChange: v => setNewTech({
                  ...newTech,
                  category: v
                }),
                children: [/*#__PURE__*/_jsx(SelectTrigger, {
                  className: "bg-background/60",
                  children: /*#__PURE__*/_jsx(SelectValue, {})
                }), /*#__PURE__*/_jsx(SelectContent, {
                  children: CATEGORIES.filter(c => c !== "Todas").map(c => /*#__PURE__*/_jsx(SelectItem, {
                    value: c,
                    children: c
                  }, c))
                })]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-1.5",
              children: [/*#__PURE__*/_jsx(Label, {
                children: "Descri\xE7\xE3o"
              }), /*#__PURE__*/_jsx(Textarea, {
                value: newTech.description,
                onChange: e => setNewTech({
                  ...newTech,
                  description: e.target.value
                }),
                className: "bg-background/60 resize-none h-24",
                placeholder: "Como a t\xE9cnica funciona?"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-1.5",
              children: [/*#__PURE__*/_jsx(Label, {
                children: "Habilidades (separadas por v\xEDrgula)"
              }), /*#__PURE__*/_jsx(Input, {
                value: newTech.abilities,
                onChange: e => setNewTech({
                  ...newTech,
                  abilities: e.target.value
                }),
                className: "bg-background/60",
                placeholder: "Habilidade 1, Habilidade 2..."
              })]
            }), /*#__PURE__*/_jsx(Button, {
              onClick: handleCreate,
              disabled: isPending,
              className: "w-full",
              children: isPending ? "Salvando..." : "Criar Técnica"
            })]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col sm:flex-row gap-3",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative flex-1",
        children: [/*#__PURE__*/_jsx(Search, {
          className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        }), /*#__PURE__*/_jsx(Input, {
          placeholder: "Buscar t\xE9cnica...",
          value: search,
          onChange: e => setSearch(e.target.value),
          className: "pl-9 bg-card/50"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "flex gap-2 flex-wrap",
        children: CATEGORIES.map(c => /*#__PURE__*/_jsx("button", {
          onClick: () => setCategory(c),
          className: `px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${category === c ? "border-primary bg-primary/10 text-primary" : "border-border/40 text-muted-foreground hover:border-primary/30"}`,
          children: c
        }, c))
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
      children: [/*#__PURE__*/_jsx("div", {
        className: "lg:col-span-1 space-y-2",
        children: isLoading ? Array.from({
          length: 5
        }).map((_, i) => /*#__PURE__*/_jsx(Skeleton, {
          className: "h-20 rounded-lg"
        }, i)) : techniques && techniques.length > 0 ? techniques.map(t => /*#__PURE__*/_jsxs("button", {
          onClick: () => setSelected(t.id),
          className: `w-full p-3 rounded-lg border text-left transition-all ${selected === t.id ? "border-primary bg-primary/10" : "border-border/40 bg-card/30 hover:border-primary/30"}`,
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-start justify-between gap-2 mb-1",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-semibold text-sm",
              children: t.name
            }), t.isCustom && /*#__PURE__*/_jsx(Badge, {
              variant: "outline",
              className: "text-xs shrink-0 text-green-400 border-green-400/30",
              children: "Original"
            })]
          }), /*#__PURE__*/_jsx("span", {
            className: `inline-block text-xs px-2 py-0.5 rounded border ${CATEGORY_COLORS[t.category] || "text-muted-foreground border-border/30"}`,
            children: t.category
          })]
        }, t.id)) : /*#__PURE__*/_jsxs("div", {
          className: "flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-card/30 border-dashed border-border",
          children: [/*#__PURE__*/_jsx(BookOpen, {
            className: "h-10 w-10 text-muted-foreground mb-3 opacity-20"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Nenhuma t\xE9cnica encontrada."
          })]
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "lg:col-span-2",
        children: selectedTech ? /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/50 sticky top-24",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "border-b border-border/40",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-start justify-between",
              children: [/*#__PURE__*/_jsx(CardTitle, {
                className: "text-xl",
                children: selectedTech.name
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex gap-2",
                children: [/*#__PURE__*/_jsx("span", {
                  className: `text-xs px-2 py-1 rounded border ${CATEGORY_COLORS[selectedTech.category] || "text-muted-foreground border-border/30"}`,
                  children: selectedTech.category
                }), selectedTech.isCustom && /*#__PURE__*/_jsx(Badge, {
                  variant: "outline",
                  className: "text-xs text-green-400 border-green-400/30",
                  children: "Original"
                })]
              })]
            }), selectedTech.source && /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-muted-foreground",
              children: ["Fonte: ", selectedTech.source]
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "pt-6 space-y-6",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h4", {
                className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2",
                children: "Descri\xE7\xE3o"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-sm leading-relaxed",
                children: selectedTech.description
              })]
            }), abilities.length > 0 && /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(Separator, {
                className: "border-border/40"
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("h4", {
                  className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3",
                  children: "Habilidades / Ataques"
                }), /*#__PURE__*/_jsx("div", {
                  className: "space-y-3",
                  children: abilities.map((ab, i) => {
                    if (typeof ab === "string") {
                      return /*#__PURE__*/_jsxs("div", {
                        className: "flex items-center gap-3 p-2.5 rounded-lg bg-primary/5 border border-primary/10",
                        children: [/*#__PURE__*/_jsx(Zap, {
                          className: "h-3.5 w-3.5 text-primary shrink-0"
                        }), /*#__PURE__*/_jsx("span", {
                          className: "text-sm",
                          children: ab
                        })]
                      }, i);
                    }
                    const a = ab;
                    return /*#__PURE__*/_jsxs("div", {
                      className: "p-3 rounded-lg bg-gradient-to-br from-primary/10 via-primary/[0.03] to-transparent border border-primary/20 hover:border-primary/40 transition-colors",
                      children: [/*#__PURE__*/_jsxs("div", {
                        className: "flex items-start justify-between gap-3 mb-2",
                        children: [/*#__PURE__*/_jsxs("div", {
                          className: "flex items-center gap-2 min-w-0",
                          children: [/*#__PURE__*/_jsx(Zap, {
                            className: "h-4 w-4 text-primary shrink-0"
                          }), /*#__PURE__*/_jsx("h5", {
                            className: "font-display tracking-wide text-sm text-white truncate",
                            children: a.name
                          })]
                        }), /*#__PURE__*/_jsxs("div", {
                          className: "flex items-center gap-1.5 shrink-0",
                          children: [a.damage && /*#__PURE__*/_jsx("span", {
                            className: "font-mono text-[10px] px-2 py-0.5 rounded border border-destructive/40 bg-destructive/10 text-red-300 uppercase tracking-wider",
                            children: a.damage
                          }), typeof a.energyCost === "number" && /*#__PURE__*/_jsxs("span", {
                            className: "font-mono text-[10px] px-2 py-0.5 rounded border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 uppercase tracking-wider",
                            children: [a.energyCost, " PE"]
                          })]
                        })]
                      }), a.description && /*#__PURE__*/_jsx("p", {
                        className: "text-xs leading-relaxed text-muted-foreground pl-6",
                        children: a.description
                      })]
                    }, i);
                  })
                })]
              })]
            })]
          })]
        }) : /*#__PURE__*/_jsxs("div", {
          className: "flex flex-col items-center justify-center h-64 text-center border rounded-lg bg-card/20 border-dashed border-border/40",
          children: [/*#__PURE__*/_jsx(Zap, {
            className: "h-12 w-12 text-muted-foreground mb-4 opacity-20"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Selecione uma t\xE9cnica para ver os detalhes."
          })]
        })
      })]
    })]
  });
}
