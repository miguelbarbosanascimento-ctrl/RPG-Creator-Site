import { useState, useRef } from "react";
import { useListCampaigns, useCreateCampaign, useDeleteCampaign, useGetCampaign, useUpdateCampaign, useListCharacters, useListBosses, getListCampaignsQueryKey, getGetCampaignQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, ScrollText, ArrowLeft, Upload, Image as ImageIcon, Calendar, Users, Skull, MapPin, BookOpen, Camera } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STATUSES = ["Em andamento", "Pausada", "Concluída", "Planejamento"];
const STATUS_COLOR = {
  "Em andamento": "hsl(160 60% 50%)",
  "Pausada": "hsl(45 80% 55%)",
  "Concluída": "hsl(265 85% 62%)",
  "Planejamento": "hsl(200 60% 55%)"
};
async function fileToCompressedDataUrl(file, maxEdge = 800) {
  const raw = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("read"));
    r.readAsDataURL(file);
  });
  const img = document.createElement("img");
  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("img"));
    img.src = raw;
  });
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return raw;
  ctx.drawImage(img, 0, 0, w, h);
  return c.toDataURL("image/jpeg", 0.78);
}
export default function CampaignsPage() {
  const [selectedId, setSelectedId] = useState(null);
  if (selectedId !== null) {
    return /*#__PURE__*/_jsx(CampaignDetail, {
      id: selectedId,
      onBack: () => setSelectedId(null)
    });
  }
  return /*#__PURE__*/_jsx(CampaignList, {
    onSelect: setSelectedId
  });
}
function CampaignList({
  onSelect
}) {
  const {
    data,
    isLoading
  } = useListCampaigns();
  const qc = useQueryClient();
  const {
    toast
  } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    synopsis: "",
    setting: "",
    status: "Em andamento",
    partyName: ""
  });
  const {
    mutate: create,
    isPending: creating
  } = useCreateCampaign({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Campanha forjada."
        });
        qc.invalidateQueries({
          queryKey: getListCampaignsQueryKey()
        });
        setOpen(false);
        setForm({
          name: "",
          synopsis: "",
          setting: "",
          status: "Em andamento",
          partyName: ""
        });
      },
      onError: () => toast({
        title: "Erro ao criar campanha",
        variant: "destructive"
      })
    }
  });
  const {
    mutate: remove
  } = useDeleteCampaign({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Campanha arquivada."
        });
        qc.invalidateQueries({
          queryKey: getListCampaignsQueryKey()
        });
      }
    }
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-8",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "relative overflow-hidden rounded-2xl border border-primary/30 glass p-6 md:p-8",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 opacity-20 pointer-events-none",
        style: {
          background: "radial-gradient(circle at 20% 30%, hsl(265 85% 62% / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, hsl(355 80% 52% / 0.15), transparent 50%)"
        }
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex flex-col md:flex-row md:items-end md:justify-between gap-4",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-jp text-xs tracking-[0.4em] text-primary/80",
              children: "\u9060\u5F81"
            }), /*#__PURE__*/_jsx("span", {
              className: "h-px w-12 bg-primary/30"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
              children: "Mesa do Mestre"
            })]
          }), /*#__PURE__*/_jsx("h1", {
            className: "font-display text-3xl md:text-4xl font-bold tracking-wider text-cursed",
            children: "CAMPANHAS"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-muted-foreground mt-2 text-sm max-w-xl",
            children: "Organize suas mesas, jogadores, agentes e amea\xE7as em uma s\xF3 ficha viva. Acompanhe arcos, sess\xF5es e ganchos de hist\xF3ria."
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
              }), " Nova Campanha"]
            })
          }), /*#__PURE__*/_jsxs(DialogContent, {
            className: "glass-strong border-primary/30 max-w-lg",
            children: [/*#__PURE__*/_jsx(DialogHeader, {
              children: /*#__PURE__*/_jsx(DialogTitle, {
                className: "font-display tracking-wider text-cursed",
                children: "NOVA EXPEDI\xC7\xC3O"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid gap-3 mt-2",
              children: [/*#__PURE__*/_jsx(Field, {
                label: "Nome da campanha",
                children: /*#__PURE__*/_jsx(Input, {
                  value: form.name,
                  onChange: e => setForm({
                    ...form,
                    name: e.target.value
                  }),
                  placeholder: "Ex: O Incidente de Shibuya...",
                  className: "bg-background/60"
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Nome do grupo (opcional)",
                children: /*#__PURE__*/_jsx(Input, {
                  value: form.partyName,
                  onChange: e => setForm({
                    ...form,
                    partyName: e.target.value
                  }),
                  placeholder: "Ex: Brigada do Crep\xFAsculo",
                  className: "bg-background/60"
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Cen\xE1rio",
                children: /*#__PURE__*/_jsx(Input, {
                  value: form.setting,
                  onChange: e => setForm({
                    ...form,
                    setting: e.target.value
                  }),
                  placeholder: "Ex: T\xF3quio Moderna, 1999...",
                  className: "bg-background/60"
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Status",
                children: /*#__PURE__*/_jsxs(Select, {
                  value: form.status,
                  onValueChange: v => setForm({
                    ...form,
                    status: v
                  }),
                  children: [/*#__PURE__*/_jsx(SelectTrigger, {
                    className: "bg-background/60",
                    children: /*#__PURE__*/_jsx(SelectValue, {})
                  }), /*#__PURE__*/_jsx(SelectContent, {
                    children: STATUSES.map(s => /*#__PURE__*/_jsx(SelectItem, {
                      value: s,
                      children: s
                    }, s))
                  })]
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Sinopse",
                children: /*#__PURE__*/_jsx(Textarea, {
                  rows: 3,
                  value: form.synopsis,
                  onChange: e => setForm({
                    ...form,
                    synopsis: e.target.value
                  }),
                  placeholder: "A premissa central, o gancho inicial, o tom da mesa...",
                  className: "bg-background/60 resize-none"
                })
              }), /*#__PURE__*/_jsx(Button, {
                onClick: () => create({
                  data: {
                    name: form.name,
                    synopsis: form.synopsis || undefined,
                    setting: form.setting || undefined,
                    status: form.status,
                    partyName: form.partyName || undefined
                  }
                }),
                disabled: creating || !form.name,
                className: "bg-primary hover:bg-primary/90 mt-2 font-display tracking-wider",
                children: creating ? "Forjando..." : "Forjar Campanha"
              })]
            })]
          })]
        })]
      })]
    }), isLoading ? /*#__PURE__*/_jsx("div", {
      className: "grid gap-5 md:grid-cols-2",
      children: [1, 2].map(i => /*#__PURE__*/_jsx(Skeleton, {
        className: "h-56 rounded-xl"
      }, i))
    }) : data && data.length > 0 ? /*#__PURE__*/_jsx("div", {
      className: "grid gap-5 md:grid-cols-2",
      children: data.map(c => {
        const color = STATUS_COLOR[c.status] ?? "hsl(265 85% 62%)";
        return /*#__PURE__*/_jsxs("button", {
          onClick: () => onSelect(c.id),
          className: "group relative overflow-hidden rounded-xl border border-border/40 glass hover:border-primary/40 transition-all hover-lift text-left",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "relative h-32 overflow-hidden",
            children: [c.coverUrl ? /*#__PURE__*/_jsx("img", {
              src: c.coverUrl,
              alt: "",
              className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            }) : /*#__PURE__*/_jsx("div", {
              className: "absolute inset-0",
              style: {
                background: `radial-gradient(circle at 30% 50%, ${color}55, transparent 60%), linear-gradient(135deg, hsl(260 25% 8%), hsl(260 30% 14%))`
              }
            }), /*#__PURE__*/_jsx("div", {
              className: "absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
            }), /*#__PURE__*/_jsx("div", {
              className: "absolute top-3 right-3",
              children: /*#__PURE__*/_jsx("span", {
                className: "text-[10px] font-bold px-2.5 py-1 rounded border font-display tracking-widest backdrop-blur-md",
                style: {
                  color,
                  borderColor: `${color}66`,
                  background: `${color}22`
                },
                children: c.status
              })
            }), /*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: e => {
                e.stopPropagation();
                if (confirm(`Arquivar "${c.name}"?`)) remove({
                  id: c.id
                });
              },
              className: "absolute top-3 left-3 p-1.5 rounded glass-strong text-muted-foreground hover:text-destructive transition-colors",
              title: "Excluir",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "h-3.5 w-3.5"
              })
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "p-5",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-display text-xl tracking-wide mb-1 text-cursed",
              children: c.name
            }), c.partyName && /*#__PURE__*/_jsxs("p", {
              className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx(Users, {
                className: "h-3 w-3"
              }), " ", c.partyName]
            }), c.currentArc && /*#__PURE__*/_jsxs("p", {
              className: "text-xs text-primary mb-2 flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx(BookOpen, {
                className: "h-3 w-3"
              }), " ", c.currentArc]
            }), c.synopsis && /*#__PURE__*/_jsx("p", {
              className: "text-xs text-muted-foreground italic line-clamp-2",
              children: c.synopsis
            })]
          })]
        }, c.id);
      })
    }) : /*#__PURE__*/_jsxs("div", {
      className: "glass rounded-xl p-12 text-center",
      children: [/*#__PURE__*/_jsx(ScrollText, {
        className: "h-12 w-12 text-primary/40 mx-auto mb-4"
      }), /*#__PURE__*/_jsx("h3", {
        className: "font-display tracking-wider text-lg",
        children: "Nenhuma campanha registrada"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-muted-foreground mt-2",
        children: "Crie sua primeira mesa e comece a tecer o destino dos seus jogadores."
      })]
    })]
  });
}
function CampaignDetail({
  id,
  onBack
}) {
  const {
    data: c,
    isLoading
  } = useGetCampaign(id);
  const {
    data: allCharacters
  } = useListCharacters();
  const {
    data: allBosses
  } = useListBosses();
  const qc = useQueryClient();
  const {
    toast
  } = useToast();
  const coverInputRef = useRef(null);
  const {
    mutate: update,
    isPending: saving
  } = useUpdateCampaign({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: getGetCampaignQueryKey(id)
        });
        qc.invalidateQueries({
          queryKey: getListCampaignsQueryKey()
        });
      }
    }
  });
  if (isLoading || !c) {
    return /*#__PURE__*/_jsxs("div", {
      className: "space-y-4",
      children: [/*#__PURE__*/_jsx(Skeleton, {
        className: "h-12 w-48"
      }), /*#__PURE__*/_jsx(Skeleton, {
        className: "h-64 rounded-xl"
      })]
    });
  }
  function save(data) {
    update({
      id,
      data
    });
  }
  async function handleCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await fileToCompressedDataUrl(file);
      save({
        coverUrl: url
      });
      toast({
        title: "Capa atualizada."
      });
    } catch {
      toast({
        title: "Erro ao processar imagem",
        variant: "destructive"
      });
    }
  }
  const playerIds = c.playerCharacterIds ? safeParseIds(c.playerCharacterIds) : [];
  const bossIds = c.bossIds ? safeParseIds(c.bossIds) : [];
  const players = (allCharacters ?? []).filter(ch => playerIds.includes(ch.id));
  const bosses = (allBosses ?? []).filter(b => bossIds.includes(b.id));
  const availableCharacters = (allCharacters ?? []).filter(ch => !playerIds.includes(ch.id));
  const availableBosses = (allBosses ?? []).filter(b => !bossIds.includes(b.id));
  function togglePlayer(charId) {
    const next = playerIds.includes(charId) ? playerIds.filter(x => x !== charId) : [...playerIds, charId];
    save({
      playerCharacterIds: JSON.stringify(next)
    });
  }
  function toggleBoss(bossId) {
    const next = bossIds.includes(bossId) ? bossIds.filter(x => x !== bossId) : [...bossIds, bossId];
    save({
      bossIds: JSON.stringify(next)
    });
  }
  const color = STATUS_COLOR[c.status] ?? "hsl(265 85% 62%)";
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs(Button, {
      variant: "ghost",
      size: "sm",
      onClick: onBack,
      className: "gap-2 text-muted-foreground hover:text-foreground",
      children: [/*#__PURE__*/_jsx(ArrowLeft, {
        className: "h-4 w-4"
      }), " Voltar \xE0s campanhas"]
    }), /*#__PURE__*/_jsx("div", {
      className: "relative overflow-hidden rounded-2xl border border-primary/30 glass-strong",
      children: /*#__PURE__*/_jsxs("div", {
        className: "relative h-56 md:h-64 overflow-hidden group",
        children: [c.coverUrl ? /*#__PURE__*/_jsx("img", {
          src: c.coverUrl,
          alt: "",
          className: "absolute inset-0 w-full h-full object-cover"
        }) : /*#__PURE__*/_jsx("div", {
          className: "absolute inset-0",
          style: {
            background: `radial-gradient(circle at 30% 50%, ${color}66, transparent 60%), linear-gradient(135deg, hsl(260 25% 8%), hsl(260 30% 14%))`
          }
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20"
        }), /*#__PURE__*/_jsxs("button", {
          onClick: () => coverInputRef.current?.click(),
          className: "absolute top-4 right-4 px-3 py-2 rounded-lg glass-strong border border-primary/30 text-xs text-foreground/80 hover:text-foreground hover:border-primary/60 transition-all flex items-center gap-2",
          children: [/*#__PURE__*/_jsx(Camera, {
            className: "h-3.5 w-3.5"
          }), " Foto de capa"]
        }), /*#__PURE__*/_jsx("input", {
          ref: coverInputRef,
          type: "file",
          accept: "image/*",
          className: "hidden",
          onChange: handleCover
        }), /*#__PURE__*/_jsxs("div", {
          className: "absolute bottom-0 left-0 right-0 p-6 md:p-8",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-jp text-xs tracking-[0.4em] text-primary/80",
              children: "\u9060\u5F81"
            }), /*#__PURE__*/_jsx("span", {
              className: "h-px w-12 bg-primary/30"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
              children: c.setting || "Cenário não definido"
            })]
          }), /*#__PURE__*/_jsx("input", {
            value: c.name,
            onChange: e => save({
              name: e.target.value
            }),
            className: "w-full bg-transparent font-display text-3xl md:text-5xl font-bold tracking-wider text-cursed outline-none"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex flex-wrap gap-2 mt-3 items-center",
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-[10px] font-bold px-2.5 py-1 rounded border font-display tracking-widest",
              style: {
                color,
                borderColor: `${color}66`,
                background: `${color}22`
              },
              children: c.status
            }), c.partyName && /*#__PURE__*/_jsxs("span", {
              className: "text-xs text-muted-foreground flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx(Users, {
                className: "h-3 w-3"
              }), " ", c.partyName]
            }), saving && /*#__PURE__*/_jsx("span", {
              className: "text-xs text-muted-foreground",
              children: "Salvando\u2026"
            })]
          })]
        })]
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "grid gap-4 md:grid-cols-3",
      children: [/*#__PURE__*/_jsx(QuickInfo, {
        icon: BookOpen,
        label: "Arco atual",
        value: c.currentArc ?? "",
        onChange: v => save({
          currentArc: v
        }),
        placeholder: "Ex: O Festival das Maldi\xE7\xF5es"
      }), /*#__PURE__*/_jsx(QuickInfo, {
        icon: Calendar,
        label: "Pr\xF3xima sess\xE3o",
        value: c.nextSession ?? "",
        onChange: v => save({
          nextSession: v
        }),
        placeholder: "Ex: Sex 25/Mai 20h"
      }), /*#__PURE__*/_jsx(QuickInfoSelect, {
        icon: ScrollText,
        label: "Status",
        value: c.status,
        options: STATUSES,
        onChange: v => save({
          status: v
        })
      })]
    }), /*#__PURE__*/_jsxs(Tabs, {
      defaultValue: "agentes",
      className: "w-full",
      children: [/*#__PURE__*/_jsxs(TabsList, {
        className: "w-full grid grid-cols-2 md:grid-cols-5 bg-background/40 border border-border/40 h-auto p-1",
        children: [/*#__PURE__*/_jsx(TabsTrigger, {
          value: "agentes",
          className: "data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-display tracking-wider",
          children: "Jogadores"
        }), /*#__PURE__*/_jsx(TabsTrigger, {
          value: "ameacas",
          className: "data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-display tracking-wider",
          children: "Amea\xE7as"
        }), /*#__PURE__*/_jsx(TabsTrigger, {
          value: "historia",
          className: "data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-display tracking-wider",
          children: "Hist\xF3ria"
        }), /*#__PURE__*/_jsx(TabsTrigger, {
          value: "mundo",
          className: "data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-display tracking-wider",
          children: "Mundo"
        }), /*#__PURE__*/_jsx(TabsTrigger, {
          value: "notas",
          className: "data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-display tracking-wider",
          children: "Notas"
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "agentes",
        className: "mt-5 space-y-4",
        children: [/*#__PURE__*/_jsxs(SectionTitle, {
          icon: Users,
          children: ["Personagens dos Jogadores (", players.length, ")"]
        }), players.length > 0 ? /*#__PURE__*/_jsx("div", {
          className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
          children: players.map(p => /*#__PURE__*/_jsxs("div", {
            className: "rounded-lg border border-primary/20 glass p-3 flex items-center justify-between gap-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "min-w-0",
              children: [/*#__PURE__*/_jsx("p", {
                className: "font-display tracking-wide truncate",
                children: p.name
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-[10px] uppercase tracking-wider text-muted-foreground truncate",
                children: [p.origin, " \xB7 ", p.specialization, " \xB7 Nv ", p.level]
              })]
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => togglePlayer(p.id),
              className: "text-muted-foreground hover:text-destructive",
              title: "Remover",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "h-3.5 w-3.5"
              })
            })]
          }, p.id))
        }) : /*#__PURE__*/_jsx("p", {
          className: "text-sm italic text-muted-foreground/60",
          children: "Nenhum jogador na campanha ainda."
        }), availableCharacters.length > 0 && /*#__PURE__*/_jsxs("div", {
          className: "mt-4",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2",
            children: "Adicionar ficha"
          }), /*#__PURE__*/_jsx("div", {
            className: "flex flex-wrap gap-2",
            children: availableCharacters.map(p => /*#__PURE__*/_jsxs("button", {
              onClick: () => togglePlayer(p.id),
              className: "text-xs px-3 py-1.5 rounded border border-primary/30 bg-primary/5 hover:bg-primary/15 hover:border-primary/50 transition-colors flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx(Plus, {
                className: "h-3 w-3"
              }), " ", p.name]
            }, p.id))
          })]
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "ameacas",
        className: "mt-5 space-y-4",
        children: [/*#__PURE__*/_jsxs(SectionTitle, {
          icon: Skull,
          children: ["Amea\xE7as da Campanha (", bosses.length, ")"]
        }), bosses.length > 0 ? /*#__PURE__*/_jsx("div", {
          className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
          children: bosses.map(b => /*#__PURE__*/_jsxs("div", {
            className: "rounded-lg border border-destructive/20 glass p-3 flex items-center justify-between gap-3",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "min-w-0 flex items-center gap-3",
              children: [b.photoUrl ? /*#__PURE__*/_jsx("img", {
                src: b.photoUrl,
                alt: "",
                className: "h-10 w-10 rounded object-cover shrink-0"
              }) : /*#__PURE__*/_jsx("div", {
                className: "h-10 w-10 rounded bg-destructive/10 flex items-center justify-center shrink-0",
                children: /*#__PURE__*/_jsx(Skull, {
                  className: "h-5 w-5 text-destructive/60"
                })
              }), /*#__PURE__*/_jsxs("div", {
                className: "min-w-0",
                children: [/*#__PURE__*/_jsx("p", {
                  className: "font-display tracking-wide truncate",
                  children: b.name
                }), /*#__PURE__*/_jsxs("p", {
                  className: "text-[10px] uppercase tracking-wider text-muted-foreground truncate",
                  children: ["VD ", b.vd, " \xB7 ", b.grade]
                })]
              })]
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => toggleBoss(b.id),
              className: "text-muted-foreground hover:text-destructive",
              title: "Remover",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "h-3.5 w-3.5"
              })
            })]
          }, b.id))
        }) : /*#__PURE__*/_jsx("p", {
          className: "text-sm italic text-muted-foreground/60",
          children: "Nenhuma amea\xE7a vinculada \xE0 campanha."
        }), availableBosses.length > 0 && /*#__PURE__*/_jsxs("div", {
          className: "mt-4",
          children: [/*#__PURE__*/_jsx("p", {
            className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2",
            children: "Adicionar amea\xE7a"
          }), /*#__PURE__*/_jsx("div", {
            className: "flex flex-wrap gap-2",
            children: availableBosses.map(b => /*#__PURE__*/_jsxs("button", {
              onClick: () => toggleBoss(b.id),
              className: "text-xs px-3 py-1.5 rounded border border-destructive/30 bg-destructive/5 hover:bg-destructive/15 hover:border-destructive/50 transition-colors flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx(Plus, {
                className: "h-3 w-3"
              }), " ", b.name, " ", /*#__PURE__*/_jsxs("span", {
                className: "text-muted-foreground",
                children: ["(VD ", b.vd, ")"]
              })]
            }, b.id))
          })]
        }), (allBosses ?? []).length === 0 && /*#__PURE__*/_jsxs("p", {
          className: "text-xs text-muted-foreground",
          children: ["Crie inimigos na se\xE7\xE3o ", /*#__PURE__*/_jsx("strong", {
            children: "Bosses"
          }), " para vincul\xE1-los aqui."]
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "historia",
        className: "mt-5 space-y-4",
        children: [/*#__PURE__*/_jsx(TextBlock, {
          label: "Sinopse",
          value: c.synopsis ?? "",
          onChange: v => save({
            synopsis: v
          }),
          placeholder: "A premissa central, o gancho inicial, o tom da mesa...",
          rows: 4
        }), /*#__PURE__*/_jsx(TextBlock, {
          label: "Di\xE1rio de Sess\xF5es",
          value: c.sessionLog ?? "",
          onChange: v => save({
            sessionLog: v
          }),
          placeholder: "Sess\xE3o 1: ... | Sess\xE3o 2: ...",
          rows: 10
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "mundo",
        className: "mt-5 space-y-4",
        children: [/*#__PURE__*/_jsx(TextBlock, {
          label: "Cen\xE1rio",
          value: c.setting ?? "",
          onChange: v => save({
            setting: v
          }),
          placeholder: "\xC9poca, lugar, regras especiais do mundo...",
          rows: 3
        }), /*#__PURE__*/_jsx(TextBlock, {
          label: "NPCs Importantes",
          value: c.npcs ?? "",
          onChange: v => save({
            npcs: v
          }),
          placeholder: "Liste mestres, aliados, mentores, antagonistas secund\xE1rios...",
          rows: 6
        }), /*#__PURE__*/_jsx(TextBlock, {
          label: "Locais & Pontos de Interesse",
          value: c.locations ?? "",
          onChange: v => save({
            locations: v
          }),
          placeholder: "Academia, esconderijos, zonas amaldi\xE7oadas...",
          rows: 6
        })]
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "notas",
        className: "mt-5 space-y-4",
        children: /*#__PURE__*/_jsx(TextBlock, {
          label: "Notas do Mestre",
          value: c.notes ?? "",
          onChange: v => save({
            notes: v
          }),
          placeholder: "Reviravoltas planejadas, segredos, callbacks, ganchos...",
          rows: 12
        })
      })]
    })]
  });
}
function safeParseIds(s) {
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr.filter(x => typeof x === "number") : [];
  } catch {
    return [];
  }
}
function QuickInfo({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "rounded-xl border border-border/40 glass p-4",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2",
      children: [/*#__PURE__*/_jsx(Icon, {
        className: "h-3 w-3"
      }), " ", label]
    }), /*#__PURE__*/_jsx(Input, {
      value: value,
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      className: "bg-background/60"
    })]
  });
}
function QuickInfoSelect({
  icon: Icon,
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "rounded-xl border border-border/40 glass p-4",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2",
      children: [/*#__PURE__*/_jsx(Icon, {
        className: "h-3 w-3"
      }), " ", label]
    }), /*#__PURE__*/_jsxs(Select, {
      value: value,
      onValueChange: onChange,
      children: [/*#__PURE__*/_jsx(SelectTrigger, {
        className: "bg-background/60",
        children: /*#__PURE__*/_jsx(SelectValue, {})
      }), /*#__PURE__*/_jsx(SelectContent, {
        children: options.map(o => /*#__PURE__*/_jsx(SelectItem, {
          value: o,
          children: o
        }, o))
      })]
    })]
  });
}
function TextBlock({
  label,
  value,
  onChange,
  placeholder,
  rows = 4
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "rounded-xl border border-border/40 glass p-4",
    children: [/*#__PURE__*/_jsx("p", {
      className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2",
      children: label
    }), /*#__PURE__*/_jsx(Textarea, {
      value: value,
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      rows: rows,
      className: "bg-background/60 resize-none"
    })]
  });
}
function SectionTitle({
  icon: Icon,
  children
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "flex items-center gap-2 mb-2",
    children: [/*#__PURE__*/_jsx(Icon, {
      className: "h-4 w-4 text-primary"
    }), /*#__PURE__*/_jsx("h3", {
      className: "font-display tracking-wider text-lg",
      children: children
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

// suppress unused warnings for icons kept for future use
void ImageIcon;
void Upload;
void MapPin;
