import { useState } from "react";
import { useListDomains, useCreateDomain, useDeleteDomain, getListDomainsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Target, Zap, Shield, Sparkles } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function DomainsPage() {
  const {
    data,
    isLoading
  } = useListDomains();
  const qc = useQueryClient();
  const {
    toast
  } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    appearance: "",
    barrier: "",
    guaranteedEffect: "",
    conditions: "",
    activationPhrase: "",
    buffs: "",
    debuffs: "",
    cost: 10
  });
  const {
    mutate: create,
    isPending: creating
  } = useCreateDomain({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Domínio selado."
        });
        qc.invalidateQueries({
          queryKey: getListDomainsQueryKey()
        });
        setOpen(false);
        setForm({
          name: "",
          appearance: "",
          barrier: "",
          guaranteedEffect: "",
          conditions: "",
          activationPhrase: "",
          buffs: "",
          debuffs: "",
          cost: 10
        });
      },
      onError: () => toast({
        title: "Erro ao criar domínio",
        variant: "destructive"
      })
    }
  });
  const {
    mutate: remove
  } = useDeleteDomain({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Domínio desfeito."
        });
        qc.invalidateQueries({
          queryKey: getListDomainsQueryKey()
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
            children: "\u9818\u57DF\u5C55\u958B"
          }), /*#__PURE__*/_jsx("span", {
            className: "h-px w-12 bg-primary/30"
          })]
        }), /*#__PURE__*/_jsx("h1", {
          className: "font-display text-3xl md:text-4xl font-bold tracking-wider text-cursed",
          children: "EXPANS\xC3O DE DOM\xCDNIO"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-muted-foreground mt-2 text-sm max-w-xl",
          children: "Manifesta\xE7\xE3o suprema da t\xE9cnica amaldi\xE7oada. Uma barreira interna onde a t\xE9cnica do feiticeiro torna-se absoluta."
        })]
      }), /*#__PURE__*/_jsxs(Dialog, {
        open: open,
        onOpenChange: setOpen,
        children: [/*#__PURE__*/_jsx(DialogTrigger, {
          asChild: true,
          children: /*#__PURE__*/_jsxs(Button, {
            className: "gap-2 bg-gradient-to-r from-destructive to-red-700 hover:to-red-600 border border-destructive/50 shadow-[0_0_25px_hsl(355_80%_52%_/_0.5)] font-display tracking-wider",
            children: [/*#__PURE__*/_jsx(Plus, {
              className: "h-4 w-4"
            }), " Forjar Dom\xEDnio"]
          })
        }), /*#__PURE__*/_jsxs(DialogContent, {
          className: "glass-strong border-destructive/30 max-w-2xl max-h-[85vh] overflow-y-auto",
          children: [/*#__PURE__*/_jsx(DialogHeader, {
            children: /*#__PURE__*/_jsx(DialogTitle, {
              className: "font-display tracking-wider text-cursed",
              children: "NOVA EXPANS\xC3O DE DOM\xCDNIO"
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid gap-3 mt-2",
            children: [/*#__PURE__*/_jsx(Field, {
              label: "Nome do Dom\xEDnio",
              children: /*#__PURE__*/_jsx(Input, {
                value: form.name,
                onChange: e => setForm({
                  ...form,
                  name: e.target.value
                }),
                placeholder: "Ex: Santu\xE1rio Maligno, Vazio Inviol\xE1vel...",
                className: "bg-background/60"
              })
            }), /*#__PURE__*/_jsx(Field, {
              label: "Frase de Ativa\xE7\xE3o",
              children: /*#__PURE__*/_jsx(Input, {
                value: form.activationPhrase,
                onChange: e => setForm({
                  ...form,
                  activationPhrase: e.target.value
                }),
                placeholder: "Ex: Expans\xE3o de Dom\xEDnio: ...",
                className: "bg-background/60 font-jp"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-3",
              children: [/*#__PURE__*/_jsx(Field, {
                label: "Custo de PE",
                children: /*#__PURE__*/_jsx(Input, {
                  type: "number",
                  min: 1,
                  value: form.cost,
                  onChange: e => setForm({
                    ...form,
                    cost: Number(e.target.value)
                  }),
                  className: "bg-background/60"
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Apar\xEAncia da Barreira",
                children: /*#__PURE__*/_jsx(Input, {
                  value: form.barrier,
                  onChange: e => setForm({
                    ...form,
                    barrier: e.target.value
                  }),
                  placeholder: "Cor, forma, s\xEDmbolos...",
                  className: "bg-background/60"
                })
              })]
            }), /*#__PURE__*/_jsx(Field, {
              label: "Apar\xEAncia Interna",
              children: /*#__PURE__*/_jsx(Textarea, {
                rows: 2,
                value: form.appearance,
                onChange: e => setForm({
                  ...form,
                  appearance: e.target.value
                }),
                placeholder: "O cen\xE1rio dentro do dom\xEDnio...",
                className: "bg-background/60 resize-none"
              })
            }), /*#__PURE__*/_jsx(Field, {
              label: "Efeito Garantido",
              children: /*#__PURE__*/_jsx(Textarea, {
                rows: 2,
                value: form.guaranteedEffect,
                onChange: e => setForm({
                  ...form,
                  guaranteedEffect: e.target.value
                }),
                placeholder: "Ataque ou efeito que SEMPRE acerta dentro do dom\xEDnio...",
                className: "bg-background/60 resize-none"
              })
            }), /*#__PURE__*/_jsx(Field, {
              label: "Condi\xE7\xF5es / Restri\xE7\xF5es",
              children: /*#__PURE__*/_jsx(Textarea, {
                rows: 2,
                value: form.conditions,
                onChange: e => setForm({
                  ...form,
                  conditions: e.target.value
                }),
                placeholder: "Limita\xE7\xF5es, votos, dura\xE7\xE3o...",
                className: "bg-background/60 resize-none"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-2 gap-3",
              children: [/*#__PURE__*/_jsx(Field, {
                label: "B\xF4nus ao Usu\xE1rio",
                children: /*#__PURE__*/_jsx(Textarea, {
                  rows: 2,
                  value: form.buffs,
                  onChange: e => setForm({
                    ...form,
                    buffs: e.target.value
                  }),
                  placeholder: "Buffs dentro do dom\xEDnio...",
                  className: "bg-background/60 resize-none"
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Penalidade aos Inimigos",
                children: /*#__PURE__*/_jsx(Textarea, {
                  rows: 2,
                  value: form.debuffs,
                  onChange: e => setForm({
                    ...form,
                    debuffs: e.target.value
                  }),
                  placeholder: "Debuffs aplicados...",
                  className: "bg-background/60 resize-none"
                })
              })]
            }), /*#__PURE__*/_jsx(Button, {
              onClick: () => create({
                data: {
                  ...form,
                  appearance: form.appearance || undefined,
                  barrier: form.barrier || undefined,
                  guaranteedEffect: form.guaranteedEffect || undefined,
                  conditions: form.conditions || undefined,
                  activationPhrase: form.activationPhrase || undefined,
                  buffs: form.buffs || undefined,
                  debuffs: form.debuffs || undefined
                }
              }),
              disabled: creating || !form.name,
              className: "bg-destructive hover:bg-destructive/90 mt-2 font-display tracking-wider",
              children: creating ? "Selando..." : "Selar Domínio"
            })]
          })]
        })]
      })]
    }), isLoading ? /*#__PURE__*/_jsx("div", {
      className: "grid gap-4 md:grid-cols-2",
      children: [1, 2].map(i => /*#__PURE__*/_jsx(Skeleton, {
        className: "h-72 rounded-xl"
      }, i))
    }) : data && data.length > 0 ? /*#__PURE__*/_jsx("div", {
      className: "grid gap-4 md:grid-cols-2",
      children: data.map(d => /*#__PURE__*/_jsxs("div", {
        className: "group relative glass rounded-xl p-6 hover-lift overflow-hidden seal-border",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-primary/5 pointer-events-none"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30 bg-destructive group-hover:opacity-60 transition-opacity"
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-primary"
        }), /*#__PURE__*/_jsxs("div", {
          className: "relative",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-start justify-between mb-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3",
              children: [/*#__PURE__*/_jsx("div", {
                className: "h-12 w-12 rounded-lg border border-destructive/50 bg-destructive/10 flex items-center justify-center text-destructive",
                children: /*#__PURE__*/_jsx(Target, {
                  className: "h-6 w-6"
                })
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("h3", {
                  className: "font-display text-lg tracking-wide text-cursed",
                  children: d.name
                }), d.activationPhrase && /*#__PURE__*/_jsxs("p", {
                  className: "font-jp text-[11px] text-primary/80 italic mt-0.5",
                  children: ["\"", d.activationPhrase, "\""]
                })]
              })]
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => remove({
                id: d.id
              }),
              className: "text-muted-foreground hover:text-destructive",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "h-4 w-4"
              })
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-3 text-xs",
            children: [/*#__PURE__*/_jsxs("span", {
              className: "px-2 py-1 rounded border border-primary/30 bg-primary/5 text-primary flex items-center gap-1",
              children: [/*#__PURE__*/_jsx(Zap, {
                className: "h-3 w-3"
              }), " ", d.cost, " PE"]
            }), d.barrier && /*#__PURE__*/_jsxs("span", {
              className: "px-2 py-1 rounded border border-border/40 bg-card/30 text-muted-foreground flex items-center gap-1",
              children: [/*#__PURE__*/_jsx(Shield, {
                className: "h-3 w-3"
              }), " ", d.barrier]
            })]
          }), d.appearance && /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-muted-foreground italic mb-3 leading-relaxed",
            children: ["\"", d.appearance, "\""]
          }), d.guaranteedEffect && /*#__PURE__*/_jsxs("div", {
            className: "mb-2 p-2 rounded border border-destructive/30 bg-destructive/5",
            children: [/*#__PURE__*/_jsxs("p", {
              className: "text-[10px] uppercase tracking-wider text-destructive mb-1 flex items-center gap-1",
              children: [/*#__PURE__*/_jsx(Sparkles, {
                className: "h-2.5 w-2.5"
              }), " Efeito Garantido"]
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs",
              children: d.guaranteedEffect
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "grid grid-cols-2 gap-2 text-xs",
            children: [d.buffs && /*#__PURE__*/_jsx(Block, {
              label: "B\xF4nus",
              content: d.buffs,
              color: "text-primary"
            }), d.debuffs && /*#__PURE__*/_jsx(Block, {
              label: "Penalidade",
              content: d.debuffs,
              color: "text-destructive"
            })]
          }), d.conditions && /*#__PURE__*/_jsxs("div", {
            className: "mt-2 pt-2 border-t border-border/30",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-1",
              children: "Condi\xE7\xF5es"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs text-muted-foreground",
              children: d.conditions
            })]
          })]
        })]
      }, d.id))
    }) : /*#__PURE__*/_jsxs("div", {
      className: "glass rounded-xl p-12 text-center",
      children: [/*#__PURE__*/_jsx(Target, {
        className: "h-12 w-12 text-destructive/40 mx-auto mb-4"
      }), /*#__PURE__*/_jsx("h3", {
        className: "font-display tracking-wider text-lg",
        children: "Nenhum dom\xEDnio forjado"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-muted-foreground mt-2",
        children: "A manifesta\xE7\xE3o suprema da t\xE9cnica amaldi\xE7oada aguarda."
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
function Block({
  label,
  content,
  color
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "p-2 rounded border border-border/40 bg-card/20",
    children: [/*#__PURE__*/_jsx("p", {
      className: `text-[10px] uppercase tracking-wider mb-1 ${color}`,
      children: label
    }), /*#__PURE__*/_jsx("p", {
      className: "text-xs leading-relaxed",
      children: content
    })]
  });
}
