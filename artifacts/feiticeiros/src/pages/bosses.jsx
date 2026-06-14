import { useState, useRef } from "react";
import { useListBosses, useCreateBoss, useDeleteBoss, useGetBoss, useUpdateBoss, getListBossesQueryKey, getGetBossQueryKey } from "@workspace/api-client-react";
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
import { Plus, Trash2, Skull, Heart, Zap, Shield, Eye, ArrowLeft, Upload, Camera, Swords, Crown, Image as ImageIcon } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CATEGORIES = ["Maldição", "Espírito Amaldiçoado", "Feiticeiro Inimigo", "Relíquia", "Boss", "Híbrido"];
const SIZES = ["Pequeno", "Médio", "Grande", "Enorme", "Colossal"];
const GRADES = ["4° Grau", "3° Grau", "2° Grau", "1° Grau", "Especial Grau"];
const GRADE_COLOR = {
  "4° Grau": "hsl(200 60% 55%)",
  "3° Grau": "hsl(160 60% 50%)",
  "2° Grau": "hsl(45 80% 55%)",
  "1° Grau": "hsl(20 85% 55%)",
  "Especial Grau": "hsl(355 80% 52%)"
};
async function fileToCompressedDataUrl(file) {
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
  const maxEdge = 480;
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return raw;
  ctx.drawImage(img, 0, 0, w, h);
  return c.toDataURL("image/jpeg", 0.8);
}
export default function BossesPage() {
  const [selectedId, setSelectedId] = useState(null);
  if (selectedId !== null) {
    return /*#__PURE__*/_jsx(BossDetail, {
      id: selectedId,
      onBack: () => setSelectedId(null)
    });
  }
  return /*#__PURE__*/_jsx(BossList, {
    onSelect: setSelectedId
  });
}
function BossList({
  onSelect
}) {
  const {
    data,
    isLoading
  } = useListBosses();
  const qc = useQueryClient();
  const {
    toast
  } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const photoInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    vd: 10,
    category: "Maldição",
    size: "Médio",
    grade: "3° Grau",
    description: "",
    appearance: "",
    photoUrl: ""
  });
  const {
    mutate: create,
    isPending: creating
  } = useCreateBoss({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Ameaça registrada na enciclopédia."
        });
        qc.invalidateQueries({
          queryKey: getListBossesQueryKey()
        });
        setOpen(false);
        setForm({
          name: "",
          vd: 10,
          category: "Maldição",
          size: "Médio",
          grade: "3° Grau",
          description: "",
          appearance: "",
          photoUrl: ""
        });
      },
      onError: () => toast({
        title: "Erro ao criar boss",
        variant: "destructive"
      })
    }
  });
  const {
    mutate: remove
  } = useDeleteBoss({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Boss exorcizado."
        });
        qc.invalidateQueries({
          queryKey: getListBossesQueryKey()
        });
      }
    }
  });
  const filtered = (data ?? []).filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()));
  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await fileToCompressedDataUrl(file);
      setForm(f => ({
        ...f,
        photoUrl: url
      }));
    } catch {
      toast({
        title: "Erro ao processar imagem",
        variant: "destructive"
      });
    }
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-8",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "relative overflow-hidden rounded-2xl border border-destructive/30 glass p-6 md:p-8",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 opacity-20 pointer-events-none",
        style: {
          background: "radial-gradient(circle at 20% 30%, hsl(355 80% 52% / 0.3), transparent 50%), radial-gradient(circle at 80% 70%, hsl(265 85% 62% / 0.2), transparent 50%)"
        }
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex flex-col md:flex-row md:items-end md:justify-between gap-4",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 mb-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-jp text-xs tracking-[0.4em] text-destructive/80",
              children: "\u546A\u970A"
            }), /*#__PURE__*/_jsx("span", {
              className: "h-px w-12 bg-destructive/30"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
              children: "Ferramenta do Mestre"
            })]
          }), /*#__PURE__*/_jsx("h1", {
            className: "font-display text-3xl md:text-4xl font-bold tracking-wider text-cursed",
            children: "BOSSES & AMEA\xC7AS"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-muted-foreground mt-2 text-sm max-w-xl",
            children: "Cat\xE1logo de inimigos para suas mesas. Crie maldi\xE7\xF5es, esp\xEDritos amaldi\xE7oados, feiticeiros advers\xE1rios e bosses com fichas completas para encontros."
          })]
        }), /*#__PURE__*/_jsxs(Dialog, {
          open: open,
          onOpenChange: setOpen,
          children: [/*#__PURE__*/_jsx(DialogTrigger, {
            asChild: true,
            children: /*#__PURE__*/_jsxs(Button, {
              className: "gap-2 bg-gradient-to-r from-destructive to-red-700 hover:to-red-600 border border-destructive/50 shadow-[0_0_20px_hsl(355_80%_52%_/_0.4)] font-display tracking-wider",
              children: [/*#__PURE__*/_jsx(Plus, {
                className: "h-4 w-4"
              }), " Forjar Amea\xE7a"]
            })
          }), /*#__PURE__*/_jsxs(DialogContent, {
            className: "glass-strong border-destructive/30 max-w-lg",
            children: [/*#__PURE__*/_jsx(DialogHeader, {
              children: /*#__PURE__*/_jsx(DialogTitle, {
                className: "font-display tracking-wider text-cursed",
                children: "NOVA AMEA\xC7A"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "grid gap-3 mt-2",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-3",
                children: [/*#__PURE__*/_jsx("button", {
                  type: "button",
                  onClick: () => photoInputRef.current?.click(),
                  className: "relative h-20 w-20 rounded-lg border-2 border-dashed border-destructive/40 bg-background/60 hover:border-destructive/70 transition-colors flex items-center justify-center overflow-hidden shrink-0",
                  children: form.photoUrl ? /*#__PURE__*/_jsx("img", {
                    src: form.photoUrl,
                    alt: "",
                    className: "absolute inset-0 w-full h-full object-cover"
                  }) : /*#__PURE__*/_jsx(ImageIcon, {
                    className: "h-6 w-6 text-destructive/60"
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex-1 space-y-1",
                  children: [/*#__PURE__*/_jsx("p", {
                    className: "text-xs text-muted-foreground",
                    children: "Foto opcional. Ser\xE1 comprimida para 480px."
                  }), /*#__PURE__*/_jsxs(Button, {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => photoInputRef.current?.click(),
                    className: "gap-2",
                    children: [/*#__PURE__*/_jsx(Upload, {
                      className: "h-3 w-3"
                    }), " Escolher imagem"]
                  })]
                }), /*#__PURE__*/_jsx("input", {
                  ref: photoInputRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: handlePhoto
                })]
              }), /*#__PURE__*/_jsx(Field, {
                label: "Nome",
                children: /*#__PURE__*/_jsx(Input, {
                  value: form.name,
                  onChange: e => setForm({
                    ...form,
                    name: e.target.value
                  }),
                  placeholder: "Ex: Sukuna, Mahito, Cabe\xE7a-de-Dedo...",
                  className: "bg-background/60"
                })
              }), /*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-3 gap-3",
                children: [/*#__PURE__*/_jsx(Field, {
                  label: "VD",
                  children: /*#__PURE__*/_jsx(Input, {
                    type: "number",
                    min: 1,
                    value: form.vd,
                    onChange: e => setForm({
                      ...form,
                      vd: Number(e.target.value)
                    }),
                    className: "bg-background/60"
                  })
                }), /*#__PURE__*/_jsx(Field, {
                  label: "Tamanho",
                  children: /*#__PURE__*/_jsxs(Select, {
                    value: form.size,
                    onValueChange: v => setForm({
                      ...form,
                      size: v
                    }),
                    children: [/*#__PURE__*/_jsx(SelectTrigger, {
                      className: "bg-background/60",
                      children: /*#__PURE__*/_jsx(SelectValue, {})
                    }), /*#__PURE__*/_jsx(SelectContent, {
                      children: SIZES.map(s => /*#__PURE__*/_jsx(SelectItem, {
                        value: s,
                        children: s
                      }, s))
                    })]
                  })
                }), /*#__PURE__*/_jsx(Field, {
                  label: "Grau",
                  children: /*#__PURE__*/_jsxs(Select, {
                    value: form.grade,
                    onValueChange: v => setForm({
                      ...form,
                      grade: v
                    }),
                    children: [/*#__PURE__*/_jsx(SelectTrigger, {
                      className: "bg-background/60",
                      children: /*#__PURE__*/_jsx(SelectValue, {})
                    }), /*#__PURE__*/_jsx(SelectContent, {
                      children: GRADES.map(g => /*#__PURE__*/_jsx(SelectItem, {
                        value: g,
                        children: g
                      }, g))
                    })]
                  })
                })]
              }), /*#__PURE__*/_jsx(Field, {
                label: "Categoria",
                children: /*#__PURE__*/_jsxs(Select, {
                  value: form.category,
                  onValueChange: v => setForm({
                    ...form,
                    category: v
                  }),
                  children: [/*#__PURE__*/_jsx(SelectTrigger, {
                    className: "bg-background/60",
                    children: /*#__PURE__*/_jsx(SelectValue, {})
                  }), /*#__PURE__*/_jsx(SelectContent, {
                    children: CATEGORIES.map(c => /*#__PURE__*/_jsx(SelectItem, {
                      value: c,
                      children: c
                    }, c))
                  })]
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Descri\xE7\xE3o curta",
                children: /*#__PURE__*/_jsx(Textarea, {
                  rows: 2,
                  value: form.description,
                  onChange: e => setForm({
                    ...form,
                    description: e.target.value
                  }),
                  placeholder: "O que \xE9 este ser? De onde vem? O que quer?",
                  className: "bg-background/60 resize-none"
                })
              }), /*#__PURE__*/_jsx(Field, {
                label: "Apar\xEAncia",
                children: /*#__PURE__*/_jsx(Textarea, {
                  rows: 2,
                  value: form.appearance,
                  onChange: e => setForm({
                    ...form,
                    appearance: e.target.value
                  }),
                  placeholder: "Tra\xE7os f\xEDsicos marcantes...",
                  className: "bg-background/60 resize-none"
                })
              }), /*#__PURE__*/_jsx(Button, {
                onClick: () => create({
                  data: {
                    name: form.name,
                    vd: form.vd,
                    category: form.category,
                    size: form.size,
                    grade: form.grade,
                    description: form.description || undefined,
                    appearance: form.appearance || undefined,
                    photoUrl: form.photoUrl || undefined
                  }
                }),
                disabled: creating || !form.name,
                className: "bg-destructive hover:bg-destructive/90 mt-2 font-display tracking-wider",
                children: creating ? "Selando..." : "Selar Ameaça"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[11px] text-muted-foreground text-center",
                children: "Atributos detalhados, t\xE9cnica e habilidades podem ser editados depois na ficha."
              })]
            })]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-3",
      children: [/*#__PURE__*/_jsx(Input, {
        placeholder: "Buscar amea\xE7a...",
        value: search,
        onChange: e => setSearch(e.target.value),
        className: "bg-background/60 max-w-sm"
      }), data && /*#__PURE__*/_jsxs("span", {
        className: "text-xs text-muted-foreground",
        children: [filtered.length, " de ", data.length]
      })]
    }), isLoading ? /*#__PURE__*/_jsx("div", {
      className: "space-y-3",
      children: [1, 2, 3, 4].map(i => /*#__PURE__*/_jsx(Skeleton, {
        className: "h-24 rounded-xl"
      }, i))
    }) : filtered.length > 0 ? /*#__PURE__*/_jsx("div", {
      className: "space-y-3",
      children: filtered.map(b => {
        const color = GRADE_COLOR[b.grade] ?? "hsl(355 80% 52%)";
        return /*#__PURE__*/_jsx("button", {
          onClick: () => onSelect(b.id),
          className: "group w-full text-left relative overflow-hidden rounded-xl border border-border/40 glass hover:border-destructive/40 transition-all hover-lift",
          children: /*#__PURE__*/_jsxs("div", {
            className: "flex items-stretch gap-0 min-h-[110px]",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "w-32 md:w-44 shrink-0 relative overflow-hidden bg-background/40",
              children: [b.photoUrl ? /*#__PURE__*/_jsx("img", {
                src: b.photoUrl,
                alt: "",
                className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              }) : /*#__PURE__*/_jsx("div", {
                className: "absolute inset-0 flex items-center justify-center",
                style: {
                  background: `radial-gradient(circle, ${color}33, transparent 70%)`
                },
                children: /*#__PURE__*/_jsx(Skull, {
                  className: "h-10 w-10 opacity-50",
                  style: {
                    color
                  }
                })
              }), /*#__PURE__*/_jsx("div", {
                className: "absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background/90 to-transparent"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 p-4 flex flex-col justify-center min-w-0",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-start gap-2 mb-1",
                children: [/*#__PURE__*/_jsx("h3", {
                  className: "font-display text-lg tracking-wide truncate",
                  children: b.name
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] font-bold px-2 py-0.5 rounded border font-display tracking-widest shrink-0",
                  style: {
                    color,
                    borderColor: `${color}66`,
                    background: `${color}11`
                  },
                  children: b.grade
                })]
              }), /*#__PURE__*/_jsxs("p", {
                className: "text-[10px] uppercase tracking-wider text-muted-foreground",
                children: ["VD: ", /*#__PURE__*/_jsx("strong", {
                  className: "text-destructive",
                  children: b.vd
                }), " \xB7 ", b.category, " \xB7 ", b.size]
              }), b.innateTechnique && /*#__PURE__*/_jsx("p", {
                className: "text-xs text-muted-foreground mt-1 italic line-clamp-1",
                children: b.innateTechnique
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2 pr-4",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "hidden md:flex items-center gap-1.5 px-2 py-1 rounded border border-destructive/30 bg-destructive/5",
                children: [/*#__PURE__*/_jsx(Heart, {
                  className: "h-3 w-3 text-destructive"
                }), /*#__PURE__*/_jsxs("strong", {
                  className: "text-xs text-destructive",
                  children: [b.hp, "/", b.maxHp]
                })]
              }), /*#__PURE__*/_jsx(Button, {
                size: "sm",
                variant: "ghost",
                className: "bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/40 font-display tracking-wider",
                children: "Ficha"
              }), /*#__PURE__*/_jsx("button", {
                type: "button",
                onClick: e => {
                  e.stopPropagation();
                  if (confirm(`Exorcizar "${b.name}"?`)) remove({
                    id: b.id
                  });
                },
                className: "text-muted-foreground hover:text-destructive transition-colors p-1",
                title: "Excluir",
                children: /*#__PURE__*/_jsx(Trash2, {
                  className: "h-3.5 w-3.5"
                })
              })]
            })]
          })
        }, b.id);
      })
    }) : /*#__PURE__*/_jsxs("div", {
      className: "glass rounded-xl p-12 text-center",
      children: [/*#__PURE__*/_jsx(Skull, {
        className: "h-12 w-12 text-destructive/40 mx-auto mb-4"
      }), /*#__PURE__*/_jsx("h3", {
        className: "font-display tracking-wider text-lg",
        children: "Nenhuma amea\xE7a registrada"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-muted-foreground mt-2",
        children: "Crie seu primeiro inimigo para popular o cat\xE1logo do mestre."
      })]
    })]
  });
}
function BossDetail({
  id,
  onBack
}) {
  const {
    data: boss,
    isLoading
  } = useGetBoss(id);
  const qc = useQueryClient();
  const {
    toast
  } = useToast();
  const photoInputRef = useRef(null);
  const {
    mutate: update,
    isPending: saving
  } = useUpdateBoss({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: getGetBossQueryKey(id)
        });
        qc.invalidateQueries({
          queryKey: getListBossesQueryKey()
        });
      }
    }
  });
  if (isLoading || !boss) {
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
  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await fileToCompressedDataUrl(file);
      save({
        photoUrl: url
      });
      toast({
        title: "Foto atualizada."
      });
    } catch {
      toast({
        title: "Erro ao processar imagem",
        variant: "destructive"
      });
    }
  }
  const color = GRADE_COLOR[boss.grade] ?? "hsl(355 80% 52%)";
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6",
    children: [/*#__PURE__*/_jsxs(Button, {
      variant: "ghost",
      size: "sm",
      onClick: onBack,
      className: "gap-2 text-muted-foreground hover:text-foreground",
      children: [/*#__PURE__*/_jsx(ArrowLeft, {
        className: "h-4 w-4"
      }), " Voltar ao cat\xE1logo"]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative overflow-hidden rounded-2xl border border-destructive/30 glass-strong",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 opacity-30 pointer-events-none",
        style: {
          background: `radial-gradient(ellipse at 20% 30%, ${color}55, transparent 60%), radial-gradient(ellipse at 80% 70%, hsl(265 85% 62% / 0.2), transparent 55%)`
        }
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative flex flex-col md:flex-row items-center md:items-start gap-6 p-6 md:p-8",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative shrink-0",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -inset-2 rounded-full blur-2xl opacity-60",
            style: {
              background: color
            }
          }), /*#__PURE__*/_jsxs("button", {
            onClick: () => photoInputRef.current?.click(),
            className: "relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-4 group cursor-pointer",
            style: {
              borderColor: color,
              boxShadow: `0 0 40px ${color}99`
            },
            children: [boss.photoUrl ? /*#__PURE__*/_jsx("img", {
              src: boss.photoUrl,
              alt: boss.name,
              className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            }) : /*#__PURE__*/_jsx("div", {
              className: "absolute inset-0 flex items-center justify-center bg-background/60",
              children: /*#__PURE__*/_jsx(Skull, {
                className: "h-16 w-16",
                style: {
                  color
                }
              })
            }), /*#__PURE__*/_jsx("div", {
              className: "absolute inset-0 bg-background/0 group-hover:bg-background/60 transition-colors flex items-center justify-center",
              children: /*#__PURE__*/_jsx(Camera, {
                className: "h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              })
            })]
          }), /*#__PURE__*/_jsx("input", {
            ref: photoInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: handlePhoto
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 text-center md:text-left space-y-3",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 justify-center md:justify-start",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-jp text-xs tracking-[0.4em] text-destructive/80",
              children: "\u546A\u970A"
            }), /*#__PURE__*/_jsx("span", {
              className: "h-px w-12 bg-destructive/30"
            }), /*#__PURE__*/_jsx("span", {
              className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
              children: boss.category
            })]
          }), /*#__PURE__*/_jsx("input", {
            value: boss.name,
            onChange: e => save({
              name: e.target.value
            }),
            className: "w-full bg-transparent font-display text-3xl md:text-5xl font-bold tracking-wider text-cursed outline-none border-b border-transparent focus:border-destructive/40 transition-colors text-center md:text-left"
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex flex-wrap gap-2 justify-center md:justify-start",
            children: [/*#__PURE__*/_jsxs(Tag, {
              color: color,
              children: ["Grau: ", boss.grade]
            }), /*#__PURE__*/_jsxs(Tag, {
              color: "hsl(355 80% 52%)",
              children: ["VD: ", boss.vd]
            }), /*#__PURE__*/_jsx(Tag, {
              color: "hsl(265 85% 62%)",
              children: boss.size
            })]
          }), boss.description && /*#__PURE__*/_jsxs("p", {
            className: "text-sm text-muted-foreground italic max-w-2xl",
            children: ["\"", boss.description, "\""]
          }), /*#__PURE__*/_jsx("div", {
            className: "flex items-center gap-2 justify-center md:justify-start text-xs text-muted-foreground",
            children: saving && /*#__PURE__*/_jsx("span", {
              children: "Salvando\u2026"
            })
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs(Tabs, {
      defaultValue: "status",
      className: "w-full",
      children: [/*#__PURE__*/_jsxs(TabsList, {
        className: "w-full grid grid-cols-2 md:grid-cols-4 bg-background/40 border border-border/40 h-auto p-1",
        children: [/*#__PURE__*/_jsx(TabsTrigger, {
          value: "status",
          className: "data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive font-display tracking-wider",
          children: "Status"
        }), /*#__PURE__*/_jsx(TabsTrigger, {
          value: "atributos",
          className: "data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive font-display tracking-wider",
          children: "Atributos"
        }), /*#__PURE__*/_jsx(TabsTrigger, {
          value: "tecnica",
          className: "data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive font-display tracking-wider",
          children: "T\xE9cnica"
        }), /*#__PURE__*/_jsx(TabsTrigger, {
          value: "notas",
          className: "data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive font-display tracking-wider",
          children: "Notas"
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "status",
        className: "mt-5 space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "grid gap-4 md:grid-cols-2",
          children: [/*#__PURE__*/_jsx(StatPanel, {
            icon: Heart,
            color: "hsl(355 80% 52%)",
            label: "Pontos de Vida",
            current: boss.hp,
            max: boss.maxHp,
            onCurrent: v => save({
              hp: v
            }),
            onMax: v => save({
              maxHp: v,
              hp: Math.min(boss.hp, v)
            })
          }), /*#__PURE__*/_jsx(StatPanel, {
            icon: Zap,
            color: "hsl(265 85% 62%)",
            label: "Energia Amaldi\xE7oada",
            current: boss.energy,
            max: boss.maxEnergy,
            onCurrent: v => save({
              energy: v
            }),
            onMax: v => save({
              maxEnergy: v,
              energy: Math.min(boss.energy, v)
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid gap-4 grid-cols-2 md:grid-cols-4",
          children: [/*#__PURE__*/_jsx(MiniStat, {
            icon: Shield,
            label: "CA",
            value: boss.armorClass,
            onChange: v => save({
              armorClass: v
            })
          }), /*#__PURE__*/_jsx(MiniStat, {
            icon: Eye,
            label: "Aten\xE7\xE3o",
            value: boss.attention,
            onChange: v => save({
              attention: v
            })
          }), /*#__PURE__*/_jsx(MiniStringStat, {
            icon: Swords,
            label: "Deslocamento",
            value: boss.movement,
            onChange: v => save({
              movement: v
            })
          }), /*#__PURE__*/_jsx(MiniStringStat, {
            icon: Crown,
            label: "Dados de Vida",
            value: boss.hitDice,
            onChange: v => save({
              hitDice: v
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "grid gap-4 md:grid-cols-2",
          children: [/*#__PURE__*/_jsx(TextBlock, {
            label: "Resist\xEAncias",
            value: boss.resistances ?? "",
            onChange: v => save({
              resistances: v
            }),
            placeholder: "Ex: Amaldi\xE7oado, Fogo, Veneno..."
          }), /*#__PURE__*/_jsx(TextBlock, {
            label: "Fraquezas",
            value: boss.weaknesses ?? "",
            onChange: v => save({
              weaknesses: v
            }),
            placeholder: "Ex: Luz solar, energia positiva..."
          })]
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "atributos",
        className: "mt-5 space-y-4",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-2 md:grid-cols-3 gap-4",
          children: [/*#__PURE__*/_jsx(AttrBox, {
            label: "For\xE7a",
            abbr: "FOR",
            value: boss.strength,
            onChange: v => save({
              strength: v
            })
          }), /*#__PURE__*/_jsx(AttrBox, {
            label: "Destreza",
            abbr: "DES",
            value: boss.dexterity,
            onChange: v => save({
              dexterity: v
            })
          }), /*#__PURE__*/_jsx(AttrBox, {
            label: "Constitui\xE7\xE3o",
            abbr: "CON",
            value: boss.constitution,
            onChange: v => save({
              constitution: v
            })
          }), /*#__PURE__*/_jsx(AttrBox, {
            label: "Intelig\xEAncia",
            abbr: "INT",
            value: boss.intelligence,
            onChange: v => save({
              intelligence: v
            })
          }), /*#__PURE__*/_jsx(AttrBox, {
            label: "Sabedoria",
            abbr: "SAB",
            value: boss.wisdom,
            onChange: v => save({
              wisdom: v
            })
          }), /*#__PURE__*/_jsx(AttrBox, {
            label: "Presen\xE7a",
            abbr: "PRE",
            value: boss.charisma,
            onChange: v => save({
              charisma: v
            })
          })]
        }), /*#__PURE__*/_jsx(TextBlock, {
          label: "Apar\xEAncia",
          value: boss.appearance ?? "",
          onChange: v => save({
            appearance: v
          }),
          placeholder: "Detalhes f\xEDsicos, escala, anomalias visuais...",
          rows: 4
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "tecnica",
        className: "mt-5 space-y-4",
        children: [/*#__PURE__*/_jsx(TextBlock, {
          label: "T\xE9cnica Inata",
          value: boss.innateTechnique ?? "",
          onChange: v => save({
            innateTechnique: v
          }),
          placeholder: "Nome da t\xE9cnica amaldi\xE7oada...",
          rows: 1
        }), /*#__PURE__*/_jsx(TextBlock, {
          label: "Descri\xE7\xE3o da T\xE9cnica",
          value: boss.techniqueDescription ?? "",
          onChange: v => save({
            techniqueDescription: v
          }),
          placeholder: "Como funciona, custos de PE, alcance...",
          rows: 6
        }), /*#__PURE__*/_jsx(TextBlock, {
          label: "Habilidades & Ataques",
          value: boss.abilities ?? "",
          onChange: v => save({
            abilities: v
          }),
          placeholder: "Liste ataques (Multiataque, Garras, Sopro Amaldi\xE7oado...), dano, condi\xE7\xF5es...",
          rows: 6
        }), /*#__PURE__*/_jsx(TextBlock, {
          label: "Expans\xE3o de Dom\xEDnio",
          value: boss.domain ?? "",
          onChange: v => save({
            domain: v
          }),
          placeholder: "Nome, efeito garantido, condi\xE7\xF5es...",
          rows: 4
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "notas",
        className: "mt-5 space-y-4",
        children: [/*#__PURE__*/_jsx(TextBlock, {
          label: "Despojos / Loot",
          value: boss.loot ?? "",
          onChange: v => save({
            loot: v
          }),
          placeholder: "Recompensas ao derrotar (objetos amaldi\xE7oados, dedos, fragmentos)...",
          rows: 4
        }), /*#__PURE__*/_jsx(TextBlock, {
          label: "Notas do Mestre",
          value: boss.notes ?? "",
          onChange: v => save({
            notes: v
          }),
          placeholder: "T\xE1ticas, segredos, ganchos de hist\xF3ria, callbacks...",
          rows: 8
        })]
      })]
    })]
  });
}
function StatPanel({
  icon: Icon,
  color,
  label,
  current,
  max,
  onCurrent,
  onMax
}) {
  const pct = Math.max(0, Math.min(100, current / Math.max(1, max) * 100));
  return /*#__PURE__*/_jsxs("div", {
    className: "rounded-xl border glass p-4",
    style: {
      borderColor: `${color}40`
    },
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between mb-2",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2 text-sm font-display tracking-wider",
        style: {
          color
        },
        children: [/*#__PURE__*/_jsx(Icon, {
          className: "h-4 w-4"
        }), " ", label]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-1 text-sm",
        children: [/*#__PURE__*/_jsx("input", {
          type: "number",
          value: current,
          onChange: e => onCurrent(Number(e.target.value)),
          className: "w-16 bg-background/60 border border-border/50 rounded px-2 py-1 text-right tabular-nums"
        }), /*#__PURE__*/_jsx("span", {
          className: "text-muted-foreground",
          children: "/"
        }), /*#__PURE__*/_jsx("input", {
          type: "number",
          value: max,
          onChange: e => onMax(Number(e.target.value)),
          className: "w-16 bg-background/60 border border-border/50 rounded px-2 py-1 text-right tabular-nums"
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "h-2 rounded-full bg-background/60 overflow-hidden",
      children: /*#__PURE__*/_jsx("div", {
        className: "h-full transition-all",
        style: {
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 12px ${color}88`
        }
      })
    })]
  });
}
function MiniStat({
  icon: Icon,
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "rounded-lg border border-border/40 glass p-3",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1",
      children: [/*#__PURE__*/_jsx(Icon, {
        className: "h-3 w-3"
      }), " ", label]
    }), /*#__PURE__*/_jsx("input", {
      type: "number",
      value: value,
      onChange: e => onChange(Number(e.target.value)),
      className: "w-full bg-transparent font-display text-2xl text-cursed outline-none tabular-nums"
    })]
  });
}
function MiniStringStat({
  icon: Icon,
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "rounded-lg border border-border/40 glass p-3",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1",
      children: [/*#__PURE__*/_jsx(Icon, {
        className: "h-3 w-3"
      }), " ", label]
    }), /*#__PURE__*/_jsx("input", {
      value: value,
      onChange: e => onChange(e.target.value),
      className: "w-full bg-transparent font-display text-lg text-cursed outline-none"
    })]
  });
}
function AttrBox({
  label,
  abbr,
  value,
  onChange
}) {
  const mod = Math.floor((value - 10) / 2);
  return /*#__PURE__*/_jsxs("div", {
    className: "relative rounded-xl border border-destructive/30 glass p-4 text-center",
    children: [/*#__PURE__*/_jsx("p", {
      className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground",
      children: label
    }), /*#__PURE__*/_jsx("p", {
      className: "font-jp text-xs text-destructive/60 mt-0.5",
      children: abbr
    }), /*#__PURE__*/_jsx("input", {
      type: "number",
      value: value,
      onChange: e => onChange(Number(e.target.value)),
      className: "w-full bg-transparent text-center font-display text-4xl text-cursed outline-none tabular-nums my-1"
    }), /*#__PURE__*/_jsxs("p", {
      className: "text-xs text-muted-foreground",
      children: ["Mod: ", /*#__PURE__*/_jsx("span", {
        className: "text-destructive font-bold",
        children: mod >= 0 ? `+${mod}` : mod
      })]
    })]
  });
}
function TextBlock({
  label,
  value,
  onChange,
  placeholder,
  rows = 3
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "rounded-xl border border-border/40 glass p-4",
    children: [/*#__PURE__*/_jsx("p", {
      className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2",
      children: label
    }), rows === 1 ? /*#__PURE__*/_jsx(Input, {
      value: value,
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      className: "bg-background/60"
    }) : /*#__PURE__*/_jsx(Textarea, {
      value: value,
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      rows: rows,
      className: "bg-background/60 resize-none"
    })]
  });
}
function Tag({
  color,
  children
}) {
  return /*#__PURE__*/_jsx("span", {
    className: "text-[10px] font-bold px-2.5 py-1 rounded border font-display tracking-widest",
    style: {
      color,
      borderColor: `${color}66`,
      background: `${color}11`
    },
    children: children
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
