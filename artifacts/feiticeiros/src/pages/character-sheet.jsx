import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useGetCharacter, useUpdateCharacter, useDeleteCharacter, getListCharactersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Pencil, Save, Trash2, Zap, Scroll, Package, User, Printer, Share2, Check, Loader2, Camera, Heart, Shield, Eye, Footprints, Dice5, Sparkles, Skull, BookOpen, Wand2 } from "lucide-react";
import { AtributosHexagon, BarraStatus, DefesaCard } from "@/components/atributos";

// ============================================================================
// Helpers
// ============================================================================
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function parseCustomStats(raw) {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(s => s && typeof s.name === "string").map(s => ({
      name: s.name,
      value: Number(s.value) || 0
    }));
  } catch {
    return [];
  }
}
function parseJsonField(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return raw ? [raw] : [];
  }
}
const UNIVERSAL_PRESETS = [{
  label: "Reforço de Energia",
  raw: "Reforço de Energia | Nível 1 | Custo: 5 PE | Alcance: Pessoal | Aumenta dano físico em 1d6 por 1 minuto."
}, {
  label: "Lampejo Negro",
  raw: "Lampejo Negro | Nível 3 | Custo: 8 PE | Dano: +2d8 amaldiçoado | Teste: DEX | Crítico instantâneo se rolar 20 natural; multiplica dano por 2.5."
}, {
  label: "Técnica Reversa",
  raw: "Técnica Reversa | Nível 4 | Custo: 12 PE | Alcance: Toque | Cura 2d8 + mod CON pontos de vida. Requer Energia Positiva."
}, {
  label: "Expansão de Domínio",
  raw: "Expansão de Domínio | Nível 6 | Custo: 25 PE | Alcance: 9m raio | Manifesta domínio interno; acerto garantido de técnica em todos os alvos por 3 turnos."
}, {
  label: "Cortina Simples",
  raw: "Cortina Simples | Nível 2 | Custo: 5 PE | Alcance: 6m raio | Cria barreira que oculta da percepção de não-feiticeiros."
}, {
  label: "Barreira de Contenção",
  raw: "Barreira de Contenção | Nível 3 | Custo: 10 PE | Alcance: 9m raio | Sela área; impede entrada e saída por 10 minutos."
}];
function AutoSaveIndicator({
  state
}) {
  if (state === "idle") return null;
  const cfg = {
    dirty: {
      icon: /*#__PURE__*/_jsx("span", {
        className: "h-2 w-2 rounded-full bg-yellow-400 animate-pulse"
      }),
      text: "Alterações pendentes...",
      cls: "text-yellow-400"
    },
    saving: {
      icon: /*#__PURE__*/_jsx(Loader2, {
        className: "h-3 w-3 animate-spin"
      }),
      text: "Salvando...",
      cls: "text-primary"
    },
    saved: {
      icon: /*#__PURE__*/_jsx(Check, {
        className: "h-3 w-3"
      }),
      text: "Salvo",
      cls: "text-green-400"
    }
  }[state];
  return /*#__PURE__*/_jsxs("span", {
    className: `inline-flex items-center gap-1.5 text-xs ${cfg.cls} animate-in fade-in`,
    children: [cfg.icon, /*#__PURE__*/_jsx("span", {
      children: cfg.text
    })]
  });
}

// Presets shared with the character creator form
const ORIGENS = ["Feiticeiro Jujutsu", "Usuário de Maldição", "Maldição Desperta", "Semi-Maldição", "Maldição Encarnada", "Caçador"];
const CLANS = ["Gojo", "Zenin", "Kamo", "Inumaki"];
const ESPECIALIZACOES = ["Lutador", "Especialista em Técnica", "Especialista em Combate", "Médico", "Estrategista", "Elementalista", "Invocador", "Manipulador", "Guardião"];
const GRAUS = ["4° Grau", "3° Grau", "2° Grau", "1° Grau", "Semi-Grau Especial", "Grau Especial"];
function gradeColor(grade) {
  if (grade.includes("Especial")) return "from-red-500/30 to-red-700/10 text-red-300 border-red-400/50";
  if (grade.includes("1°")) return "from-orange-500/30 to-orange-700/10 text-orange-300 border-orange-400/50";
  if (grade.includes("2°")) return "from-amber-500/30 to-amber-700/10 text-amber-300 border-amber-400/50";
  if (grade.includes("3°")) return "from-cyan-500/30 to-cyan-700/10 text-cyan-300 border-cyan-400/50";
  return "from-muted/30 to-muted/10 text-muted-foreground border-border/40";
}

// Resize image client-side and return data URL (JPEG, ~600px max edge, q=0.85)
/** Compress and resize an image file to a small JPEG data URL without blocking the main thread. */
async function fileToDataUrl(file) {
  // Use createObjectURL — doesn't block the thread unlike readAsDataURL on large files
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Falha ao carregar imagem"));
      image.src = objectUrl;
    });
    const maxEdge = 480;
    const scale = Math.min(1, maxEdge / Math.max(img.width || 1, img.height || 1));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas não disponível");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// ============================================================================
// Main
// ============================================================================

export default function CharacterSheet() {
  const {
    id
  } = useParams();
  const [, navigate] = useLocation();
  const {
    toast
  } = useToast();
  const numId = parseInt(id ?? "0", 10);
  const queryClient = useQueryClient();
  const {
    data: character,
    isLoading
  } = useGetCharacter(numId);
  const {
    mutate: updateCharacter,
    isPending: isUpdating
  } = useUpdateCharacter();
  const {
    mutate: deleteCharacter,
    isPending: isDeleting
  } = useDeleteCharacter();
  const [editingText, setEditingText] = useState(false);
  // numeric / always-on
  const [editHp, setEditHp] = useState(0);
  const [editEnergy, setEditEnergy] = useState(0);
  const [editSoul, setEditSoul] = useState(10);
  const [editLevel, setEditLevel] = useState(1);
  const [editExperience, setEditExperience] = useState(0);
  const [editArmorClass, setEditArmorClass] = useState(10);
  const [editAttention, setEditAttention] = useState(10);
  const [editMaxHp, setEditMaxHp] = useState(0);
  const [editMaxEnergy, setEditMaxEnergy] = useState(0);
  const [editMaxSoul, setEditMaxSoul] = useState(0);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editOrigin, setEditOrigin] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");
  const [editClanHeritage, setEditClanHeritage] = useState("");
  const [editStr, setEditStr] = useState(1);
  const [editDex, setEditDex] = useState(1);
  const [editCon, setEditCon] = useState(1);
  const [editInt, setEditInt] = useState(1);
  const [editWis, setEditWis] = useState(1);
  const [editCha, setEditCha] = useState(1);
  const [editCustomStats, setEditCustomStats] = useState([]);
  const [editAbilities, setEditAbilities] = useState([]);

  // text fields (always editable when in textEdit mode)
  const [editNotes, setEditNotes] = useState("");
  const [editPersonality, setEditPersonality] = useState("");
  const [editBackstory, setEditBackstory] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [editOccupation, setEditOccupation] = useState("");
  const [editAppearance, setEditAppearance] = useState("");
  const [editIdeals, setEditIdeals] = useState("");
  const [editBonds, setEditBonds] = useState("");
  const [editComplications, setEditComplications] = useState("");
  const [editInnateDomain, setEditInnateDomain] = useState("");
  const [editMovement, setEditMovement] = useState("9m");
  const [editHitDice, setEditHitDice] = useState("1d8");
  const [editResistances, setEditResistances] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState(null);
  const [autoSaveState, setAutoSaveState] = useState("idle");
  const autoSaveTimer = useRef(null);
  const writeRevisionRef = useRef(0);
  const lastAppliedRevisionRef = useRef(0);
  const initializedRef = useRef(false);
  const seededSkipRef = useRef(false);
  const photoInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const lastSentPhotoRef = useRef(null);
  useEffect(() => {
    initializedRef.current = false;
    seededSkipRef.current = false;
    writeRevisionRef.current = 0;
    lastAppliedRevisionRef.current = 0;
  }, [numId]);
  useEffect(() => {
    if (!character || initializedRef.current) return;
    setEditHp(character.hp);
    setEditEnergy(character.energy);
    setEditSoul(character.soulIntegrity ?? 10);
    setEditLevel(character.level);
    setEditExperience(character.experience);
    setEditArmorClass(character.armorClass);
    setEditAttention(character.attention ?? 10);
    setEditStr(character.strength);
    setEditDex(character.dexterity);
    setEditCon(character.constitution);
    setEditInt(character.intelligence);
    setEditWis(character.wisdom);
    setEditCha(character.charisma);
    setEditCustomStats(parseCustomStats(character.customStats));
    setEditAbilities(parseJsonField(character.abilities));
    setEditNotes(character.notes ?? "");
    setEditPersonality(character.personality ?? "");
    setEditBackstory(character.backstory ?? "");
    setEditAge(character.age ?? "");
    setEditHeight(character.height ?? "");
    setEditWeight(character.weight ?? "");
    setEditSchool(character.school ?? "");
    setEditOccupation(character.occupation ?? "");
    setEditAppearance(character.appearance ?? "");
    setEditIdeals(character.ideals ?? "");
    setEditBonds(character.bonds ?? "");
    setEditComplications(character.complications ?? "");
    setEditInnateDomain(character.innateDomain ?? "");
    setEditMovement(character.movement ?? "9m");
    setEditHitDice(character.hitDice ?? `${character.level}d8`);
    setEditResistances(character.resistances ?? "");
    setEditPhotoUrl(character.photoUrl ?? null);
    lastSentPhotoRef.current = character.photoUrl ?? null;
    setEditMaxHp(character.maxHp ?? 10 + character.constitution + (character.level - 1) * 5);
    setEditMaxEnergy(character.maxEnergy ?? 10 + character.wisdom + (character.level - 1) * 5);
    setEditMaxSoul(character.maxSoulIntegrity ?? 10 + character.charisma + (character.level - 1) * 2);
    setEditName(character.name);
    setEditGrade(character.grade);
    setEditOrigin(character.origin);
    setEditSpecialization(character.specialization);
    setEditClanHeritage(character.clanHeritage ?? "");
    initializedRef.current = true;
  }, [character]);
  function performUpdate(rev) {
    const safeLevel = Math.max(1, Math.min(20, editLevel || 1));
    const newMaxHp = Math.max(1, editMaxHp || 1);
    const newMaxEnergy = Math.max(1, editMaxEnergy || 1);
    const newMaxSoul = Math.max(1, editMaxSoul || 1);
    // Allow values to exceed max (overheal / temp buffs, CRIS-style). Only floor at 0.
    const persistedHp = Math.max(0, editHp);
    const persistedEnergy = Math.max(0, editEnergy);
    const persistedSoul = Math.max(0, editSoul);
    const payload = {
      hp: persistedHp,
      energy: persistedEnergy,
      soulIntegrity: persistedSoul,
      maxSoulIntegrity: newMaxSoul,
      notes: editNotes,
      personality: editPersonality,
      backstory: editBackstory,
      level: safeLevel,
      experience: Math.max(0, editExperience),
      armorClass: editArmorClass,
      attention: editAttention,
      strength: editStr,
      dexterity: editDex,
      constitution: editCon,
      intelligence: editInt,
      wisdom: editWis,
      charisma: editCha,
      maxHp: newMaxHp,
      maxEnergy: newMaxEnergy,
      customStats: JSON.stringify(editCustomStats),
      abilities: JSON.stringify(editAbilities.filter(a => a.trim())),
      age: editAge,
      height: editHeight,
      weight: editWeight,
      school: editSchool,
      occupation: editOccupation,
      appearance: editAppearance,
      ideals: editIdeals,
      bonds: editBonds,
      complications: editComplications,
      innateDomain: editInnateDomain,
      movement: editMovement || "9m",
      hitDice: editHitDice || `${safeLevel}d8`,
      resistances: editResistances,
      name: editName || character?.name || "",
      grade: editGrade || character?.grade || "",
      origin: editOrigin || character?.origin || "",
      specialization: editSpecialization || character?.specialization || "",
      clanHeritage: editClanHeritage
    };
    // Only include photoUrl when it actually changed to avoid resending large data URL on every keystroke.
    const currentPhoto = editPhotoUrl ?? "";
    const lastPhoto = lastSentPhotoRef.current ?? "";
    if (currentPhoto !== lastPhoto) {
      payload.photoUrl = currentPhoto;
    }
    updateCharacter({
      id: numId,
      data: payload
    }, {
      onSuccess: () => {
        if (currentPhoto !== lastPhoto) {
          lastSentPhotoRef.current = currentPhoto;
          // Photo changed — invalidate the dashboard list so it shows the new photo immediately
          queryClient.invalidateQueries({
            queryKey: getListCharactersQueryKey()
          });
        }
        if (rev <= lastAppliedRevisionRef.current) return;
        lastAppliedRevisionRef.current = rev;
        if (rev === writeRevisionRef.current) {
          setAutoSaveState("saved");
          setTimeout(() => setAutoSaveState(s => s === "saved" ? "idle" : s), 1500);
        }
      },
      onError: () => setAutoSaveState("dirty")
    });
  }
  useEffect(() => {
    if (!initializedRef.current) return;
    if (!seededSkipRef.current) {
      seededSkipRef.current = true;
      return;
    }
    writeRevisionRef.current += 1;
    const rev = writeRevisionRef.current;
    setAutoSaveState("dirty");
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      setAutoSaveState("saving");
      performUpdate(rev);
    }, 900);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editHp, editEnergy, editSoul, editNotes, editPersonality, editBackstory, editLevel, editExperience, editArmorClass, editAttention, editStr, editDex, editCon, editInt, editWis, editCha, editCustomStats, editAbilities, editAge, editHeight, editWeight, editSchool, editOccupation, editAppearance, editIdeals, editBonds, editComplications, editInnateDomain, editMovement, editHitDice, editResistances, editPhotoUrl, editMaxHp, editMaxEnergy, editMaxSoul, editName, editGrade, editOrigin, editSpecialization, editClanHeritage]);
  function addCustomStat(name) {
    if (editCustomStats.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      toast({
        title: "Atributo já existe",
        variant: "destructive"
      });
      return;
    }
    setEditCustomStats([...editCustomStats, {
      name,
      value: 1
    }]);
  }
  function flushAndCloseText() {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    writeRevisionRef.current += 1;
    performUpdate(writeRevisionRef.current);
    setEditingText(false);
  }
  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Selecione uma imagem",
        variant: "destructive"
      });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({
        title: "Imagem muito grande (máx 8MB)",
        variant: "destructive"
      });
      return;
    }
    setUploadingPhoto(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setEditPhotoUrl(dataUrl);
    } catch {
      toast({
        title: "Falha ao processar imagem",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }
  function handlePrint() {
    window.print();
  }
  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: character?.name ?? "Ficha",
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!",
          description: "Compartilhe com seu mestre ou grupo."
        });
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!"
        });
      } catch {
        toast({
          title: "Não foi possível copiar o link",
          variant: "destructive"
        });
      }
    }
  }
  function handleDelete() {
    deleteCharacter({
      id: numId
    }, {
      onSuccess: () => {
        toast({
          title: "Ficha excluída."
        });
        navigate("/");
      }
    });
  }
  if (isLoading) {
    return /*#__PURE__*/_jsxs("div", {
      className: "space-y-6 max-w-6xl mx-auto animate-in fade-in",
      children: [/*#__PURE__*/_jsx(Skeleton, {
        className: "h-10 w-64"
      }), /*#__PURE__*/_jsx(Skeleton, {
        className: "h-64 rounded-xl"
      }), /*#__PURE__*/_jsx(Skeleton, {
        className: "h-10 rounded-lg"
      }), /*#__PURE__*/_jsx("div", {
        className: "grid grid-cols-3 gap-4",
        children: [1, 2, 3, 4, 5, 6].map(i => /*#__PURE__*/_jsx(Skeleton, {
          className: "h-24 rounded-lg"
        }, i))
      })]
    });
  }
  if (!character) {
    return /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center justify-center py-16 text-center",
      children: [/*#__PURE__*/_jsx("p", {
        className: "text-lg text-muted-foreground",
        children: "Personagem n\xE3o encontrado."
      }), /*#__PURE__*/_jsx(Link, {
        href: "/",
        children: /*#__PURE__*/_jsx(Button, {
          variant: "outline",
          className: "mt-4",
          children: "Voltar ao Dashboard"
        })
      })]
    });
  }
  const aptitudes = parseJsonField(character.aptitudes);
  const skills = parseJsonField(character.skills);
  const equipment = parseJsonField(character.equipment);
  const abilities = parseJsonField(character.abilities);
  const maxHp = editMaxHp || 10 + editCon + (editLevel - 1) * 5;
  const maxEnergy = editMaxEnergy || 10 + editWis + (editLevel - 1) * 5;
  const maxSoul = editMaxSoul || 10 + editCha + (editLevel - 1) * 2;
  const formulaHp = 10 + editCon + (editLevel - 1) * 5;
  const formulaEnergy = 10 + editWis + (editLevel - 1) * 5;
  const formulaSoul = 10 + editCha + (editLevel - 1) * 2;
  const modFor = Math.floor((editStr - 10) / 2);
  const modDex = Math.floor((editDex - 10) / 2);
  const iniciativa = editDex;
  return /*#__PURE__*/_jsxs("div", {
    className: "max-w-6xl mx-auto space-y-5 animate-in fade-in duration-500",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between flex-wrap gap-3",
      children: [/*#__PURE__*/_jsx(Link, {
        href: "/",
        children: /*#__PURE__*/_jsxs(Button, {
          variant: "ghost",
          size: "sm",
          className: "gap-2 text-muted-foreground hover:text-foreground",
          children: [/*#__PURE__*/_jsx(ArrowLeft, {
            className: "h-4 w-4"
          }), " Fichas"]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex gap-2 items-center",
        children: [/*#__PURE__*/_jsx(AutoSaveIndicator, {
          state: autoSaveState
        }), editingText ? /*#__PURE__*/_jsxs(Button, {
          variant: "outline",
          size: "sm",
          onClick: flushAndCloseText,
          disabled: isUpdating,
          className: "gap-2",
          children: [/*#__PURE__*/_jsx(Save, {
            className: "h-4 w-4"
          }), " Concluir edi\xE7\xE3o"]
        }) : /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsxs(Button, {
            variant: "ghost",
            size: "sm",
            onClick: handleShare,
            className: "gap-2 text-muted-foreground hover:text-primary print:hidden",
            children: [/*#__PURE__*/_jsx(Share2, {
              className: "h-4 w-4"
            }), " ", /*#__PURE__*/_jsx("span", {
              className: "hidden sm:inline",
              children: "Compartilhar"
            })]
          }), /*#__PURE__*/_jsxs(Button, {
            variant: "ghost",
            size: "sm",
            onClick: handlePrint,
            className: "gap-2 text-muted-foreground hover:text-primary print:hidden",
            children: [/*#__PURE__*/_jsx(Printer, {
              className: "h-4 w-4"
            }), " ", /*#__PURE__*/_jsx("span", {
              className: "hidden sm:inline",
              children: "PDF"
            })]
          }), /*#__PURE__*/_jsxs(Button, {
            variant: "outline",
            size: "sm",
            onClick: () => setEditingText(true),
            className: "gap-2 print:hidden",
            children: [/*#__PURE__*/_jsx(Pencil, {
              className: "h-4 w-4"
            }), " Editar textos"]
          }), /*#__PURE__*/_jsxs(AlertDialog, {
            children: [/*#__PURE__*/_jsx(AlertDialogTrigger, {
              asChild: true,
              children: /*#__PURE__*/_jsx(Button, {
                variant: "ghost",
                size: "sm",
                className: "gap-2 text-muted-foreground hover:text-destructive print:hidden",
                children: /*#__PURE__*/_jsx(Trash2, {
                  className: "h-4 w-4"
                })
              })
            }), /*#__PURE__*/_jsxs(AlertDialogContent, {
              className: "bg-card border-border/60",
              children: [/*#__PURE__*/_jsxs(AlertDialogHeader, {
                children: [/*#__PURE__*/_jsx(AlertDialogTitle, {
                  children: "Excluir ficha?"
                }), /*#__PURE__*/_jsxs(AlertDialogDescription, {
                  children: ["A ficha de ", /*#__PURE__*/_jsx("strong", {
                    children: character.name
                  }), " ser\xE1 permanentemente exclu\xEDda."]
                })]
              }), /*#__PURE__*/_jsxs(AlertDialogFooter, {
                children: [/*#__PURE__*/_jsx(AlertDialogCancel, {
                  children: "Cancelar"
                }), /*#__PURE__*/_jsx(AlertDialogAction, {
                  onClick: handleDelete,
                  disabled: isDeleting,
                  className: "bg-destructive hover:bg-destructive/90",
                  children: isDeleting ? "Excluindo..." : "Excluir"
                })]
              })]
            })]
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card/90 via-card/60 to-background/40 backdrop-blur-xl",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "absolute inset-0 pointer-events-none",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 animate-domain",
          style: {
            background: "radial-gradient(circle, hsl(265 85% 50% / 0.6), transparent 70%)"
          }
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-domain",
          style: {
            background: "radial-gradient(circle, hsl(355 80% 45% / 0.5), transparent 70%)",
            animationDelay: "2s"
          }
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute inset-0 bg-cursed-grid opacity-20"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "relative shrink-0 group",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-primary via-purple-600 to-destructive opacity-60 blur-md animate-pulse-glow"
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute inset-0 -m-1 rounded-full border-2 border-primary/40"
          }), /*#__PURE__*/_jsxs("div", {
            className: "relative h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden border-2 border-primary/70 bg-card/80 shadow-[0_0_40px_hsl(265_85%_50%_/_0.5)]",
            children: [editPhotoUrl ? /*#__PURE__*/_jsx("img", {
              src: editPhotoUrl,
              alt: character.name,
              className: "h-full w-full object-cover"
            }) : /*#__PURE__*/_jsx("div", {
              className: "h-full w-full flex items-center justify-center text-6xl font-display font-bold bg-gradient-to-br from-primary/30 to-destructive/20 text-white/60",
              children: character.name.charAt(0).toUpperCase()
            }), /*#__PURE__*/_jsx("div", {
              className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
            }), /*#__PURE__*/_jsx("button", {
              type: "button",
              onClick: () => photoInputRef.current?.click(),
              disabled: uploadingPhoto,
              className: "absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity print:hidden",
              title: "Alterar foto",
              children: uploadingPhoto ? /*#__PURE__*/_jsx(Loader2, {
                className: "h-6 w-6 text-primary animate-spin"
              }) : /*#__PURE__*/_jsxs(_Fragment, {
                children: [/*#__PURE__*/_jsx(Camera, {
                  className: "h-7 w-7 text-primary"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-[10px] uppercase tracking-widest text-white/90",
                  children: "Trocar foto"
                })]
              })
            }), /*#__PURE__*/_jsx("input", {
              ref: photoInputRef,
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: handlePhotoChange
            })]
          }), editPhotoUrl && /*#__PURE__*/_jsx("button", {
            type: "button",
            onClick: () => setEditPhotoUrl(null),
            className: "absolute -top-1 -right-1 h-7 w-7 rounded-full bg-destructive/90 hover:bg-destructive border border-destructive-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity print:hidden",
            title: "Remover foto",
            children: /*#__PURE__*/_jsx(Trash2, {
              className: "h-3.5 w-3.5 text-white"
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "absolute -bottom-4 left-1/2 -translate-x-1/2 font-jp text-xs tracking-[0.4em] text-primary/70 whitespace-nowrap bg-background/80 px-2 rounded",
            children: "\u8853\u5E2B"
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 min-w-0 space-y-3 text-center md:text-left",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "space-y-1",
            children: [/*#__PURE__*/_jsx("div", {
              className: "font-jp text-xs tracking-[0.5em] text-primary/60",
              children: "FEITICEIRO"
            }), /*#__PURE__*/_jsx(ClickToEditInline, {
              value: editName,
              onChange: setEditName,
              placeholder: "Nome do feiticeiro",
              className: "font-display text-4xl md:text-5xl font-bold tracking-wide text-cursed leading-tight",
              inputClassName: "font-display text-4xl md:text-5xl font-bold tracking-wide leading-tight bg-background/60 border-primary/40 h-auto py-1 px-2"
            })]
          }), /*#__PURE__*/_jsx(PresetPicker, {
            value: editGrade,
            onChange: setEditGrade,
            presets: GRAUS,
            label: "Grau de Feiticeiro",
            placeholder: "Definir grau",
            renderTrigger: (val, open) => /*#__PURE__*/_jsxs("button", {
              type: "button",
              onClick: open,
              className: `inline-flex items-center gap-2 px-3 py-1 rounded-full border font-display tracking-wider text-xs uppercase bg-gradient-to-r ${gradeColor(val || "4° Grau")} hover:brightness-125 transition-all cursor-pointer`,
              title: "Clique para mudar o grau",
              children: [/*#__PURE__*/_jsx(Skull, {
                className: "h-3 w-3 shrink-0"
              }), val || "Definir grau"]
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex flex-wrap gap-1.5 justify-center md:justify-start items-center",
            children: [/*#__PURE__*/_jsx(PresetTag, {
              color: "violet",
              value: editOrigin,
              onChange: setEditOrigin,
              presets: ORIGENS,
              label: "Origem",
              placeholder: "Origem"
            }), /*#__PURE__*/_jsx(PresetTag, {
              color: "cyan",
              value: editSpecialization,
              onChange: setEditSpecialization,
              presets: ESPECIALIZACOES,
              label: "Especializa\xE7\xE3o",
              placeholder: "Especializa\xE7\xE3o"
            }), /*#__PURE__*/_jsx(PresetTag, {
              color: "red",
              value: editClanHeritage,
              onChange: setEditClanHeritage,
              presets: CLANS,
              label: "Cl\xE3 / Fam\xEDlia",
              placeholder: "Cl\xE3 / Fam\xEDlia",
              prefix: "Cl\xE3 "
            }), editSchool && /*#__PURE__*/_jsx(Tag, {
              color: "muted",
              children: editSchool
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3 flex-wrap justify-center md:justify-start text-sm",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-[10px] uppercase tracking-widest text-muted-foreground",
                children: "Nv"
              }), /*#__PURE__*/_jsx(Input, {
                type: "number",
                min: 1,
                max: 20,
                value: editLevel,
                onChange: e => setEditLevel(Number(e.target.value) || 1),
                className: "w-14 h-7 text-center font-bold text-sm bg-background/60 border-primary/30"
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1.5",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-[10px] uppercase tracking-widest text-muted-foreground",
                children: "XP"
              }), /*#__PURE__*/_jsx(Input, {
                type: "number",
                min: 0,
                value: editExperience,
                onChange: e => setEditExperience(Number(e.target.value) || 0),
                className: "w-20 h-7 text-sm bg-background/60 border-primary/30"
              })]
            }), /*#__PURE__*/_jsxs("span", {
              className: "text-xs text-muted-foreground",
              children: ["Maestria ", /*#__PURE__*/_jsxs("strong", {
                className: "text-primary",
                children: ["+", Math.ceil((editLevel + 3) / 4)]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "w-full md:w-80 space-y-2 shrink-0",
          children: [/*#__PURE__*/_jsx(BarraStatus, {
            label: "Pontos de Vida",
            value: editHp,
            max: maxHp,
            color: "red",
            onChange: setEditHp,
            onMaxChange: setEditMaxHp
          }), /*#__PURE__*/_jsx(BarraStatus, {
            label: "Pontos de Energia",
            value: editEnergy,
            max: maxEnergy,
            color: "primary",
            onChange: setEditEnergy,
            onMaxChange: setEditMaxEnergy
          }), /*#__PURE__*/_jsx(BarraStatus, {
            label: "Integridade da Alma",
            value: editSoul,
            max: maxSoul,
            color: "primary",
            onChange: setEditSoul,
            onMaxChange: setEditMaxSoul
          })]
        })]
      })]
    }), /*#__PURE__*/_jsxs(Tabs, {
      defaultValue: "overview",
      className: "w-full",
      children: [/*#__PURE__*/_jsxs(TabsList, {
        className: "w-full h-auto flex-wrap justify-start gap-1 bg-card/40 border border-border/40 backdrop-blur p-1.5 rounded-xl",
        children: [/*#__PURE__*/_jsx(TabTrigger, {
          value: "overview",
          icon: User,
          children: "Vis\xE3o Geral"
        }), /*#__PURE__*/_jsx(TabTrigger, {
          value: "status",
          icon: Shield,
          children: "Status"
        }), /*#__PURE__*/_jsx(TabTrigger, {
          value: "techniques",
          icon: Zap,
          children: "T\xE9cnicas"
        }), /*#__PURE__*/_jsx(TabTrigger, {
          value: "domain",
          icon: Wand2,
          children: "Dom\xEDnio"
        }), /*#__PURE__*/_jsx(TabTrigger, {
          value: "inventory",
          icon: Package,
          children: "Invent\xE1rio"
        }), /*#__PURE__*/_jsx(TabTrigger, {
          value: "aptitudes",
          icon: Sparkles,
          children: "Aptid\xF5es"
        }), /*#__PURE__*/_jsx(TabTrigger, {
          value: "history",
          icon: BookOpen,
          children: "Hist\xF3ria"
        }), /*#__PURE__*/_jsx(TabTrigger, {
          value: "notes",
          icon: Scroll,
          children: "Anota\xE7\xF5es"
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "overview",
        className: "space-y-5 mt-5 focus-visible:outline-none",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "grid grid-cols-1 lg:grid-cols-3 gap-5",
          children: [/*#__PURE__*/_jsxs(Card, {
            className: "border-border/50 bg-card/40 backdrop-blur lg:col-span-1",
            children: [/*#__PURE__*/_jsx(CardHeader, {
              className: "pb-3",
              children: /*#__PURE__*/_jsxs(CardTitle, {
                className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2",
                children: [/*#__PURE__*/_jsx(User, {
                  className: "h-3.5 w-3.5 text-primary"
                }), " Identidade"]
              })
            }), /*#__PURE__*/_jsx(CardContent, {
              className: "space-y-3",
              children: editingText ? /*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-2 gap-2",
                children: [/*#__PURE__*/_jsx(FieldInput, {
                  label: "Idade",
                  value: editAge,
                  onChange: setEditAge,
                  placeholder: "17"
                }), /*#__PURE__*/_jsx(FieldInput, {
                  label: "Altura",
                  value: editHeight,
                  onChange: setEditHeight,
                  placeholder: "1,75m"
                }), /*#__PURE__*/_jsx(FieldInput, {
                  label: "Peso",
                  value: editWeight,
                  onChange: setEditWeight,
                  placeholder: "65kg"
                }), /*#__PURE__*/_jsx(FieldInput, {
                  label: "Escola",
                  value: editSchool,
                  onChange: setEditSchool,
                  placeholder: "T\xF3quio"
                }), /*#__PURE__*/_jsx(FieldInput, {
                  label: "Ocupa\xE7\xE3o",
                  value: editOccupation,
                  onChange: setEditOccupation,
                  placeholder: "Estudante"
                }), /*#__PURE__*/_jsx(FieldInput, {
                  label: "Deslocamento",
                  value: editMovement,
                  onChange: setEditMovement,
                  placeholder: "9m"
                })]
              }) : /*#__PURE__*/_jsxs("dl", {
                className: "grid grid-cols-2 gap-x-3 gap-y-2 text-sm",
                children: [/*#__PURE__*/_jsx(InfoLine, {
                  label: "Idade",
                  value: editAge
                }), /*#__PURE__*/_jsx(InfoLine, {
                  label: "Altura",
                  value: editHeight
                }), /*#__PURE__*/_jsx(InfoLine, {
                  label: "Peso",
                  value: editWeight
                }), /*#__PURE__*/_jsx(InfoLine, {
                  label: "Escola",
                  value: editSchool
                }), /*#__PURE__*/_jsx(InfoLine, {
                  label: "Ocupa\xE7\xE3o",
                  value: editOccupation
                }), /*#__PURE__*/_jsx(InfoLine, {
                  label: "Deslocamento",
                  value: editMovement
                })]
              })
            })]
          }), /*#__PURE__*/_jsxs(Card, {
            className: "border-border/50 bg-card/40 backdrop-blur lg:col-span-2",
            children: [/*#__PURE__*/_jsx(CardHeader, {
              className: "pb-3",
              children: /*#__PURE__*/_jsxs(CardTitle, {
                className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2",
                children: [/*#__PURE__*/_jsx(Eye, {
                  className: "h-3.5 w-3.5 text-primary"
                }), " Apar\xEAncia"]
              })
            }), /*#__PURE__*/_jsx(CardContent, {
              children: /*#__PURE__*/_jsx(ClickToEditTextarea, {
                forceEditing: editingText,
                value: editAppearance,
                onChange: setEditAppearance,
                display: editAppearance,
                placeholder: "Descreva tra\xE7os f\xEDsicos, vestimenta, marcas...",
                emptyLabel: "Clique para descrever a apar\xEAncia",
                rows: 4
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/40 backdrop-blur",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            className: "pb-3",
            children: /*#__PURE__*/_jsxs(CardTitle, {
              className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(Sparkles, {
                className: "h-3.5 w-3.5 text-primary"
              }), " Atributos"]
            })
          }), /*#__PURE__*/_jsxs(CardContent, {
            children: [/*#__PURE__*/_jsx(AtributosHexagon, {
              baseStats: [{
                abbr: "FOR",
                label: "Força",
                value: editStr,
                onChange: setEditStr
              }, {
                abbr: "DEX",
                label: "Destreza",
                value: editDex,
                onChange: setEditDex
              }, {
                abbr: "CON",
                label: "Constituição",
                value: editCon,
                onChange: setEditCon
              }, {
                abbr: "INT",
                label: "Inteligência",
                value: editInt,
                onChange: setEditInt
              }, {
                abbr: "SAB",
                label: "Sabedoria",
                value: editWis,
                onChange: setEditWis
              }, {
                abbr: "PRE",
                label: "Presença",
                value: editCha,
                onChange: setEditCha
              }],
              customStats: editCustomStats,
              onCustomStatChange: (idx, v) => setEditCustomStats(editCustomStats.map((s, i) => i === idx ? {
                ...s,
                value: v
              } : s)),
              onCustomStatRemove: idx => setEditCustomStats(editCustomStats.filter((_, i) => i !== idx)),
              onAddCustomStat: addCustomStat
            }), skills.length > 0 && /*#__PURE__*/_jsxs("div", {
              className: "mt-5",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2",
                children: "Per\xEDcias Dominadas"
              }), /*#__PURE__*/_jsx("div", {
                className: "flex flex-wrap gap-1.5",
                children: skills.map(s => /*#__PURE__*/_jsx("span", {
                  className: "text-xs px-2 py-0.5 rounded-md border border-primary/30 bg-primary/5 text-primary/90",
                  children: s
                }, s))
              })]
            })]
          })]
        })]
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "status",
        className: "space-y-5 mt-5 focus-visible:outline-none",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "grid gap-4 md:grid-cols-2",
          children: [/*#__PURE__*/_jsxs(StatusPanel, {
            icon: Heart,
            label: "Pontos de Vida",
            color: "red",
            children: [/*#__PURE__*/_jsx(BarraStatus, {
              label: "PV atual",
              value: editHp,
              max: maxHp,
              color: "red",
              onChange: setEditHp,
              onMaxChange: setEditMaxHp
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between gap-2 mt-2",
              children: [/*#__PURE__*/_jsxs("p", {
                className: "text-[10px] text-muted-foreground",
                children: ["F\xF3rmula: 10 + CON + (Nv-1)\xD75 = ", /*#__PURE__*/_jsx("strong", {
                  className: "text-foreground/80",
                  children: formulaHp
                })]
              }), maxHp !== formulaHp && /*#__PURE__*/_jsx("button", {
                type: "button",
                onClick: () => setEditMaxHp(formulaHp),
                className: "text-[10px] px-2 py-0.5 rounded border border-border/40 hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors",
                children: "Recalcular"
              })]
            })]
          }), /*#__PURE__*/_jsxs(StatusPanel, {
            icon: Zap,
            label: "Pontos de Energia",
            color: "primary",
            children: [/*#__PURE__*/_jsx(BarraStatus, {
              label: "PE atual",
              value: editEnergy,
              max: maxEnergy,
              color: "primary",
              onChange: setEditEnergy,
              onMaxChange: setEditMaxEnergy
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between gap-2 mt-2",
              children: [/*#__PURE__*/_jsxs("p", {
                className: "text-[10px] text-muted-foreground",
                children: ["F\xF3rmula: 10 + SAB + (Nv-1)\xD75 = ", /*#__PURE__*/_jsx("strong", {
                  className: "text-foreground/80",
                  children: formulaEnergy
                })]
              }), maxEnergy !== formulaEnergy && /*#__PURE__*/_jsx("button", {
                type: "button",
                onClick: () => setEditMaxEnergy(formulaEnergy),
                className: "text-[10px] px-2 py-0.5 rounded border border-border/40 hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors",
                children: "Recalcular"
              })]
            })]
          }), /*#__PURE__*/_jsxs(StatusPanel, {
            icon: Sparkles,
            label: "Integridade da Alma",
            color: "primary",
            children: [/*#__PURE__*/_jsx(BarraStatus, {
              label: "Integridade",
              value: editSoul,
              max: maxSoul,
              color: "primary",
              onChange: setEditSoul,
              onMaxChange: setEditMaxSoul
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between gap-2 mt-2",
              children: [/*#__PURE__*/_jsxs("p", {
                className: "text-[10px] text-muted-foreground",
                children: ["F\xF3rmula: 10 + PRE + (Nv-1)\xD72 = ", /*#__PURE__*/_jsx("strong", {
                  className: "text-foreground/80",
                  children: formulaSoul
                })]
              }), maxSoul !== formulaSoul && /*#__PURE__*/_jsx("button", {
                type: "button",
                onClick: () => setEditMaxSoul(formulaSoul),
                className: "text-[10px] px-2 py-0.5 rounded border border-border/40 hover:border-primary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors",
                children: "Recalcular"
              })]
            })]
          }), /*#__PURE__*/_jsx(StatusPanel, {
            icon: Shield,
            label: "Defesas e Reflexos",
            color: "cyan",
            children: /*#__PURE__*/_jsx(DefesaCard, {
              ca: editArmorClass,
              iniciativa: iniciativa,
              onCaChange: setEditArmorClass
            })
          }), /*#__PURE__*/_jsx(StatusPanel, {
            icon: Eye,
            label: "Aten\xE7\xE3o",
            color: "cyan",
            children: /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-3",
              children: [/*#__PURE__*/_jsx(Input, {
                type: "number",
                min: 0,
                value: editAttention,
                onChange: e => setEditAttention(Number(e.target.value) || 0),
                className: "w-20 h-12 text-center text-2xl font-bold bg-background/60 border-cyan-400/30"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "Percep\xE7\xE3o passiva contra surpresa, ilus\xE3o e oculta\xE7\xE3o."
              })]
            })
          }), /*#__PURE__*/_jsxs(StatusPanel, {
            icon: Footprints,
            label: "Deslocamento",
            color: "muted",
            children: [/*#__PURE__*/_jsx(Input, {
              value: editMovement,
              onChange: e => setEditMovement(e.target.value),
              className: "bg-background/60 text-sm font-mono",
              placeholder: "9m",
              disabled: !editingText
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[10px] mt-2 text-muted-foreground",
              children: "Dist\xE2ncia percorrida por a\xE7\xE3o de movimento."
            })]
          }), /*#__PURE__*/_jsxs(StatusPanel, {
            icon: Dice5,
            label: "Dados de Vida",
            color: "red",
            children: [/*#__PURE__*/_jsx(Input, {
              value: editHitDice,
              onChange: e => setEditHitDice(e.target.value),
              className: "bg-background/60 text-sm font-mono",
              placeholder: "1d8",
              disabled: !editingText
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[10px] mt-2 text-muted-foreground",
              children: "Use durante descansos curtos para recuperar PV."
            })]
          }), /*#__PURE__*/_jsx(StatusPanel, {
            icon: Shield,
            label: "Resist\xEAncias",
            color: "violet",
            children: /*#__PURE__*/_jsx(ClickToEditTextarea, {
              forceEditing: editingText,
              value: editResistances,
              onChange: setEditResistances,
              display: editResistances,
              placeholder: "Ex: Amaldi\xE7oado, Fogo, Veneno...",
              emptyLabel: "Clique para adicionar resist\xEAncias",
              rows: 3
            })
          })]
        }), /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/30 backdrop-blur",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            className: "pb-3",
            children: /*#__PURE__*/_jsx(CardTitle, {
              className: "text-xs uppercase tracking-widest text-muted-foreground",
              children: "Modificadores R\xE1pidos"
            })
          }), /*#__PURE__*/_jsxs(CardContent, {
            children: [/*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-3 md:grid-cols-6 gap-2 text-center",
              children: [{
                l: "FOR",
                v: editStr,
                m: Math.floor((editStr - 10) / 2)
              }, {
                l: "DEX",
                v: editDex,
                m: modDex
              }, {
                l: "CON",
                v: editCon,
                m: Math.floor((editCon - 10) / 2)
              }, {
                l: "INT",
                v: editInt,
                m: Math.floor((editInt - 10) / 2)
              }, {
                l: "SAB",
                v: editWis,
                m: Math.floor((editWis - 10) / 2)
              }, {
                l: "PRE",
                v: editCha,
                m: Math.floor((editCha - 10) / 2)
              }].map(x => /*#__PURE__*/_jsxs("div", {
                className: "p-2 rounded-lg bg-background/40 border border-border/30",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "text-[10px] uppercase tracking-widest text-muted-foreground",
                  children: x.l
                }), /*#__PURE__*/_jsx("div", {
                  className: "font-mono text-lg font-bold text-foreground",
                  children: x.v
                }), /*#__PURE__*/_jsxs("div", {
                  className: `text-xs font-mono ${x.m >= 0 ? "text-primary" : "text-destructive"}`,
                  children: [x.m >= 0 ? "+" : "", x.m]
                })]
              }, x.l))
            }), /*#__PURE__*/_jsxs("div", {
              className: "mt-3 text-[10px] text-muted-foreground text-center",
              children: ["Iniciativa ", /*#__PURE__*/_jsxs("strong", {
                className: "text-foreground font-mono",
                children: ["+", modDex]
              }), /*#__PURE__*/_jsx("span", {
                className: "mx-2",
                children: "\u2022"
              }), "Dano corpo a corpo ", /*#__PURE__*/_jsxs("strong", {
                className: "text-foreground font-mono",
                children: ["+", modFor]
              })]
            })]
          })]
        })]
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "techniques",
        className: "space-y-5 mt-5 focus-visible:outline-none",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-primary/30 bg-gradient-to-br from-primary/10 via-card/40 to-transparent backdrop-blur",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            children: /*#__PURE__*/_jsxs(CardTitle, {
              className: "text-base flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(Zap, {
                className: "h-4 w-4 text-primary"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-primary",
                children: character.technique || "Sem técnica inata"
              })]
            })
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "space-y-4",
            children: [character.technique_description && /*#__PURE__*/_jsx("p", {
              className: "text-sm text-muted-foreground leading-relaxed",
              children: character.technique_description
            }), editingText ? /*#__PURE__*/_jsxs("div", {
              className: "space-y-3",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-between",
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
                  children: "Habilidades, Movimentos e Universais"
                }), /*#__PURE__*/_jsx(Button, {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setEditAbilities([...editAbilities, ""]),
                  className: "h-7 text-xs",
                  children: "+ Em branco"
                })]
              }), /*#__PURE__*/_jsx("div", {
                className: "flex flex-wrap gap-1.5",
                children: UNIVERSAL_PRESETS.map(p => /*#__PURE__*/_jsxs(Button, {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setEditAbilities([...editAbilities, p.raw]),
                  className: "h-7 text-xs border-primary/30 text-primary hover:bg-primary/10",
                  children: ["+ ", p.label]
                }, p.label))
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-2",
                children: [editAbilities.map((ab, idx) => /*#__PURE__*/_jsxs("div", {
                  className: "flex gap-2 items-start",
                  children: [/*#__PURE__*/_jsx(Textarea, {
                    value: ab,
                    onChange: e => setEditAbilities(editAbilities.map((x, i) => i === idx ? e.target.value : x)),
                    className: "bg-background/60 text-xs resize-none h-20 font-mono",
                    placeholder: "Nome | N\xEDvel X | Custo: Y PE | Dano: ZdW | Descri\xE7\xE3o..."
                  }), /*#__PURE__*/_jsx(Button, {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setEditAbilities(editAbilities.filter((_, i) => i !== idx)),
                    className: "h-7 px-2 text-destructive hover:text-destructive shrink-0",
                    children: /*#__PURE__*/_jsx(Trash2, {
                      className: "h-3.5 w-3.5"
                    })
                  })]
                }, idx)), editAbilities.length === 0 && /*#__PURE__*/_jsx("p", {
                  className: "text-xs text-muted-foreground text-center py-3",
                  children: "Nenhuma habilidade. Use os bot\xF5es acima."
                })]
              })]
            }) : abilities.length > 0 ? /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2",
                children: "Habilidades, Movimentos e Universais"
              }), /*#__PURE__*/_jsx("div", {
                className: "grid gap-2 md:grid-cols-2",
                children: abilities.map((ab, idx) => /*#__PURE__*/_jsx(AbilityCard, {
                  raw: ab
                }, `${ab}-${idx}`))
              })]
            }) : null]
          })]
        })
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "domain",
        className: "space-y-5 mt-5 focus-visible:outline-none",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "relative overflow-hidden border-primary/30 bg-gradient-to-br from-purple-950/30 via-card/40 to-transparent backdrop-blur",
          children: [/*#__PURE__*/_jsx("div", {
            className: "absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30",
            style: {
              background: "radial-gradient(circle, hsl(265 85% 50% / 0.6), transparent 70%)"
            }
          }), /*#__PURE__*/_jsx(CardHeader, {
            className: "relative",
            children: /*#__PURE__*/_jsxs(CardTitle, {
              className: "flex items-center gap-2 text-base",
              children: [/*#__PURE__*/_jsx(Wand2, {
                className: "h-4 w-4 text-primary"
              }), " Expans\xE3o de Dom\xEDnio Inata", /*#__PURE__*/_jsx("span", {
                className: "font-jp text-xs tracking-widest text-primary/60 ml-2",
                children: "\u9818\u57DF\u5C55\u958B"
              })]
            })
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "relative space-y-4",
            children: [/*#__PURE__*/_jsx(ClickToEditTextarea, {
              forceEditing: editingText,
              value: editInnateDomain,
              onChange: setEditInnateDomain,
              display: editInnateDomain,
              placeholder: "Nome do dom\xEDnio, apar\xEAncia, efeito garantido, condi\xE7\xF5es de ativa\xE7\xE3o...",
              emptyLabel: "Clique para definir o dom\xEDnio inato \u2014 ou use o criador abaixo",
              rows: 6
            }), /*#__PURE__*/_jsx("div", {
              className: "flex gap-2 pt-2 border-t border-border/30",
              children: /*#__PURE__*/_jsx(Link, {
                href: "/dominios",
                children: /*#__PURE__*/_jsxs(Button, {
                  variant: "outline",
                  size: "sm",
                  className: "gap-2 border-primary/40 hover:bg-primary/10",
                  children: [/*#__PURE__*/_jsx(Wand2, {
                    className: "h-3.5 w-3.5"
                  }), " Criador de Dom\xEDnios"]
                })
              })
            })]
          })]
        })
      }), /*#__PURE__*/_jsxs(TabsContent, {
        value: "inventory",
        className: "space-y-5 mt-5 focus-visible:outline-none",
        children: [/*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/40 backdrop-blur",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            className: "pb-3",
            children: /*#__PURE__*/_jsxs(CardTitle, {
              className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(Package, {
                className: "h-3.5 w-3.5 text-primary"
              }), " Equipamentos e Ferramentas"]
            })
          }), /*#__PURE__*/_jsx(CardContent, {
            children: equipment.length === 0 ? /*#__PURE__*/_jsx("p", {
              className: "text-sm italic text-muted-foreground/60",
              children: "Invent\xE1rio vazio. Edite na tela de cria\xE7\xE3o para adicionar."
            }) : /*#__PURE__*/_jsx("div", {
              className: "grid gap-2 sm:grid-cols-2",
              children: equipment.map(item => /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 p-3 rounded-lg bg-background/40 border border-border/40 text-sm hover:border-primary/30 transition-colors",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                }), item]
              }, item))
            })
          })]
        }), skills.length > 0 && /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/40 backdrop-blur",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            className: "pb-3",
            children: /*#__PURE__*/_jsx(CardTitle, {
              className: "text-xs uppercase tracking-widest text-muted-foreground",
              children: "Per\xEDcias"
            })
          }), /*#__PURE__*/_jsx(CardContent, {
            children: /*#__PURE__*/_jsx("div", {
              className: "flex flex-wrap gap-1.5",
              children: skills.map(s => /*#__PURE__*/_jsx("span", {
                className: "text-xs px-2.5 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary/90",
                children: s
              }, s))
            })
          })]
        })]
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "aptitudes",
        className: "space-y-5 mt-5 focus-visible:outline-none",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/40 backdrop-blur",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            className: "pb-3",
            children: /*#__PURE__*/_jsxs(CardTitle, {
              className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(Sparkles, {
                className: "h-3.5 w-3.5 text-primary"
              }), " Aptid\xF5es Amaldi\xE7oadas"]
            })
          }), /*#__PURE__*/_jsxs(CardContent, {
            children: [aptitudes.length === 0 ? /*#__PURE__*/_jsx("p", {
              className: "text-sm italic text-muted-foreground/60",
              children: "Nenhuma aptid\xE3o escolhida."
            }) : /*#__PURE__*/_jsx("div", {
              className: "grid gap-2 md:grid-cols-2",
              children: aptitudes.map(apt => /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/30 text-sm",
                children: [/*#__PURE__*/_jsx(Sparkles, {
                  className: "h-3.5 w-3.5 text-primary shrink-0"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-foreground",
                  children: apt
                })]
              }, apt))
            }), /*#__PURE__*/_jsx("div", {
              className: "mt-3 pt-3 border-t border-border/30",
              children: /*#__PURE__*/_jsx(Link, {
                href: "/aptidoes",
                children: /*#__PURE__*/_jsxs(Button, {
                  variant: "outline",
                  size: "sm",
                  className: "gap-2 border-primary/40 hover:bg-primary/10",
                  children: [/*#__PURE__*/_jsx(BookOpen, {
                    className: "h-3.5 w-3.5"
                  }), " Ver cat\xE1logo completo"]
                })
              })
            })]
          })]
        })
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "history",
        className: "space-y-5 mt-5 focus-visible:outline-none",
        children: /*#__PURE__*/_jsxs("div", {
          className: "grid gap-5 lg:grid-cols-2",
          children: [/*#__PURE__*/_jsx(NarrativeCard, {
            icon: User,
            label: "Personalidade",
            editing: editingText,
            value: editPersonality,
            onChange: setEditPersonality,
            display: editPersonality,
            placeholder: "Tra\xE7os de personalidade, maneirismos, h\xE1bitos..."
          }), /*#__PURE__*/_jsx(NarrativeCard, {
            icon: Scroll,
            label: "Hist\xF3ria",
            editing: editingText,
            value: editBackstory,
            onChange: setEditBackstory,
            display: editBackstory,
            placeholder: "Origem, eventos marcantes, motiva\xE7\xF5es...",
            rows: 6
          }), /*#__PURE__*/_jsx(NarrativeCard, {
            icon: Sparkles,
            label: "Ideais",
            editing: editingText,
            value: editIdeals,
            onChange: setEditIdeals,
            display: editIdeals,
            placeholder: "Cren\xE7as, valores, o que move o personagem..."
          }), /*#__PURE__*/_jsx(NarrativeCard, {
            icon: Heart,
            label: "Liga\xE7\xF5es",
            editing: editingText,
            value: editBonds,
            onChange: setEditBonds,
            display: editBonds,
            placeholder: "Pessoas, lugares ou objetos importantes..."
          }), /*#__PURE__*/_jsx(NarrativeCard, {
            icon: Skull,
            label: "Complica\xE7\xF5es",
            editing: editingText,
            value: editComplications,
            onChange: setEditComplications,
            display: editComplications,
            placeholder: "Defeitos, traumas, segredos, fraquezas..."
          })]
        })
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "notes",
        className: "space-y-5 mt-5 focus-visible:outline-none",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/40 backdrop-blur",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            className: "pb-3",
            children: /*#__PURE__*/_jsxs(CardTitle, {
              className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(Scroll, {
                className: "h-3.5 w-3.5 text-primary"
              }), " Anota\xE7\xF5es Livres"]
            })
          }), /*#__PURE__*/_jsx(CardContent, {
            children: /*#__PURE__*/_jsx(ClickToEditTextarea, {
              forceEditing: editingText,
              value: editNotes,
              onChange: setEditNotes,
              display: editNotes,
              placeholder: "Notas, votos de restri\xE7\xE3o, observa\xE7\xF5es da campanha, segredos do personagem...",
              emptyLabel: "Clique para come\xE7ar a anotar",
              rows: 8
            })
          })]
        })
      })]
    })]
  });
}

// ============================================================================
// Small subcomponents
// ============================================================================

function TabTrigger({
  value,
  icon: Icon,
  children
}) {
  return /*#__PURE__*/_jsxs(TabsTrigger, {
    value: value,
    className: "gap-1.5 text-xs uppercase tracking-wider font-display data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-[0_0_12px_hsl(265_85%_62%_/_0.35)] data-[state=active]:border-primary/40 border border-transparent rounded-lg px-3 h-8",
    children: [/*#__PURE__*/_jsx(Icon, {
      className: "h-3.5 w-3.5"
    }), children]
  });
}
function Tag({
  children,
  color
}) {
  const cls = {
    violet: "bg-primary/15 border-primary/40 text-primary",
    cyan: "bg-cyan-400/10 border-cyan-400/40 text-cyan-300",
    red: "bg-destructive/15 border-destructive/40 text-red-300",
    muted: "bg-card/60 border-border/50 text-muted-foreground"
  }[color];
  return /*#__PURE__*/_jsx("span", {
    className: `inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${cls}`,
    children: children
  });
}
function StatusPanel({
  icon: Icon,
  label,
  color,
  children
}) {
  const ring = {
    red: "border-destructive/30 shadow-[0_0_24px_hsl(355_80%_45%_/_0.15)]",
    primary: "border-primary/30 shadow-[0_0_24px_hsl(265_85%_50%_/_0.15)]",
    cyan: "border-cyan-400/30 shadow-[0_0_24px_hsl(200_90%_55%_/_0.15)]",
    violet: "border-purple-400/30 shadow-[0_0_24px_hsl(265_85%_62%_/_0.15)]",
    muted: "border-border/40"
  }[color];
  const iconColor = {
    red: "text-destructive",
    primary: "text-primary",
    cyan: "text-cyan-300",
    violet: "text-purple-300",
    muted: "text-muted-foreground"
  }[color];
  return /*#__PURE__*/_jsxs(Card, {
    className: `bg-card/40 backdrop-blur ${ring}`,
    children: [/*#__PURE__*/_jsx(CardHeader, {
      className: "pb-3",
      children: /*#__PURE__*/_jsxs(CardTitle, {
        className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(Icon, {
          className: `h-3.5 w-3.5 ${iconColor}`
        }), " ", label]
      })
    }), /*#__PURE__*/_jsx(CardContent, {
      children: children
    })]
  });
}
function FieldInput({
  label,
  value,
  onChange,
  placeholder
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-1",
    children: [/*#__PURE__*/_jsx(Label, {
      className: "text-[10px] uppercase tracking-widest text-muted-foreground",
      children: label
    }), /*#__PURE__*/_jsx(Input, {
      value: value,
      onChange: e => onChange(e.target.value),
      placeholder: placeholder,
      className: "h-8 text-sm bg-background/60"
    })]
  });
}
function InfoLine({
  label,
  value
}) {
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("dt", {
      className: "text-[10px] uppercase tracking-widest text-muted-foreground self-center",
      children: label
    }), /*#__PURE__*/_jsx("dd", {
      className: "text-sm text-foreground font-medium",
      children: value || /*#__PURE__*/_jsx("span", {
        className: "text-muted-foreground/50 italic",
        children: "\u2014"
      })
    })]
  });
}
function NarrativeCard({
  icon: Icon,
  label,
  editing,
  value,
  onChange,
  display,
  placeholder,
  rows = 4
}) {
  return /*#__PURE__*/_jsxs(Card, {
    className: "border-border/50 bg-card/40 backdrop-blur",
    children: [/*#__PURE__*/_jsx(CardHeader, {
      className: "pb-3",
      children: /*#__PURE__*/_jsxs(CardTitle, {
        className: "text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(Icon, {
          className: "h-3.5 w-3.5 text-primary"
        }), " ", label]
      })
    }), /*#__PURE__*/_jsx(CardContent, {
      children: /*#__PURE__*/_jsx(ClickToEditTextarea, {
        forceEditing: editing,
        value: value,
        onChange: onChange,
        display: display,
        placeholder: placeholder,
        rows: rows
      })
    })]
  });
}

/** Popover picker that shows preset buttons + an "Outro" custom input. */
function PresetPicker({
  value,
  onChange,
  presets,
  label,
  placeholder,
  renderTrigger
}) {
  const [open, setOpen] = useState(false);
  const isCustom = value !== "" && !presets.includes(value);
  const [customDraft, setCustomDraft] = useState(isCustom ? value : "");
  useEffect(() => {
    if (open) setCustomDraft(isCustom ? value : "");
  }, [open, value, isCustom]);
  function pick(v) {
    onChange(v);
    setOpen(false);
  }
  function commitCustom() {
    const v = customDraft.trim();
    if (v) {
      onChange(v);
      setOpen(false);
    }
  }
  return /*#__PURE__*/_jsxs(Popover, {
    open: open,
    onOpenChange: setOpen,
    children: [/*#__PURE__*/_jsx(PopoverTrigger, {
      asChild: true,
      children: /*#__PURE__*/_jsx("span", {
        children: renderTrigger(value, () => setOpen(true))
      })
    }), /*#__PURE__*/_jsxs(PopoverContent, {
      className: "w-72 p-3 bg-card/95 backdrop-blur border-primary/30",
      children: [/*#__PURE__*/_jsx("p", {
        className: "text-[10px] uppercase tracking-widest text-muted-foreground mb-2",
        children: label
      }), /*#__PURE__*/_jsx("div", {
        className: "flex flex-col gap-1 mb-3",
        children: presets.map(p => /*#__PURE__*/_jsx("button", {
          type: "button",
          onClick: () => pick(p),
          className: `text-left text-sm px-2.5 py-1.5 rounded-md transition-colors ${value === p ? "bg-primary/20 text-primary border border-primary/40" : "hover:bg-primary/10 text-foreground border border-transparent"}`,
          children: p
        }, p))
      }), /*#__PURE__*/_jsxs("div", {
        className: "space-y-1.5 pt-2 border-t border-border/40",
        children: [/*#__PURE__*/_jsxs(Label, {
          className: "text-[10px] uppercase tracking-widest text-muted-foreground",
          children: ["Outro ", isCustom && "(atual)"]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex gap-1.5",
          children: [/*#__PURE__*/_jsx(Input, {
            value: customDraft,
            onChange: e => setCustomDraft(e.target.value),
            onKeyDown: e => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitCustom();
              }
            },
            placeholder: placeholder,
            className: "h-8 text-sm bg-background/60",
            autoFocus: isCustom
          }), /*#__PURE__*/_jsx(Button, {
            type: "button",
            size: "sm",
            onClick: commitCustom,
            disabled: !customDraft.trim(),
            className: "h-8 px-3",
            children: "Usar"
          })]
        })]
      }), value && /*#__PURE__*/_jsx("button", {
        type: "button",
        onClick: () => pick(""),
        className: "mt-3 text-[10px] text-muted-foreground hover:text-destructive transition-colors w-full text-center",
        children: "Limpar"
      })]
    })]
  });
}

/** Editable tag pill backed by a PresetPicker — colored chip that opens a presets+custom popover. */
function PresetTag({
  color,
  value,
  onChange,
  presets,
  label,
  placeholder,
  prefix = ""
}) {
  const colorMap = {
    violet: "border-violet-400/40 bg-violet-500/10 text-violet-200",
    cyan: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
    red: "border-red-400/40 bg-red-500/10 text-red-200"
  }[color];
  return /*#__PURE__*/_jsx(PresetPicker, {
    value: value,
    onChange: onChange,
    presets: presets,
    label: label,
    placeholder: placeholder,
    renderTrigger: (val, open) => val ? /*#__PURE__*/_jsxs("button", {
      type: "button",
      onClick: open,
      className: `text-xs px-2.5 py-0.5 rounded-full border ${colorMap} hover:brightness-125 transition-all cursor-pointer`,
      title: "Clique para alterar",
      children: [prefix, val]
    }) : /*#__PURE__*/_jsxs("button", {
      type: "button",
      onClick: open,
      className: "text-xs px-2.5 py-0.5 rounded-full border border-dashed border-border/40 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground/60 italic inline-flex items-center gap-1 transition-colors",
      title: "Clique para escolher",
      children: [/*#__PURE__*/_jsx(Pencil, {
        className: "h-2.5 w-2.5"
      }), " ", placeholder]
    })
  });
}

/** Single-line click-to-edit text input: displays value as text, becomes Input on click. */
function ClickToEditInline({
  value,
  onChange,
  placeholder,
  className,
  inputClassName
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);
  useEffect(() => {
    if (editing) {
      setDraft(value);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing, value]);
  function commit() {
    onChange(draft.trim());
    setEditing(false);
  }
  if (editing) {
    return /*#__PURE__*/_jsx(Input, {
      ref: inputRef,
      value: draft,
      onChange: e => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: e => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      },
      placeholder: placeholder,
      className: inputClassName
    });
  }
  return /*#__PURE__*/_jsx("span", {
    role: "button",
    tabIndex: 0,
    onClick: () => setEditing(true),
    onKeyDown: e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setEditing(true);
      }
    },
    className: `group inline-flex items-center gap-1.5 rounded-md hover:bg-primary/5 px-1 -mx-1 transition-colors cursor-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className ?? ""}`,
    title: "Clique para editar",
    children: value ? /*#__PURE__*/_jsx("span", {
      children: value
    }) : /*#__PURE__*/_jsxs("span", {
      className: "italic text-muted-foreground/60 normal-case font-normal tracking-normal text-sm flex items-center gap-1",
      children: [/*#__PURE__*/_jsx(Pencil, {
        className: "h-3 w-3"
      }), " ", placeholder]
    })
  });
}

/** Editable tag pill: shows colored chip; click to edit inline. */
function EditableTag({
  color,
  value,
  onChange,
  placeholder,
  prefix = ""
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);
  useEffect(() => {
    if (editing) {
      setDraft(value);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing, value]);
  function commit() {
    onChange(draft.trim());
    setEditing(false);
  }
  const colorMap = {
    violet: "border-violet-400/40 bg-violet-500/10 text-violet-200 focus-within:border-violet-300/80",
    cyan: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200 focus-within:border-cyan-300/80",
    red: "border-red-400/40 bg-red-500/10 text-red-200 focus-within:border-red-300/80"
  }[color];
  if (editing) {
    return /*#__PURE__*/_jsx("input", {
      ref: inputRef,
      value: draft,
      onChange: e => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: e => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      },
      placeholder: placeholder,
      className: `text-xs px-2.5 py-0.5 rounded-full border outline-none w-40 ${colorMap}`
    });
  }
  if (!value) {
    return /*#__PURE__*/_jsxs("button", {
      type: "button",
      onClick: () => setEditing(true),
      className: `text-xs px-2.5 py-0.5 rounded-full border border-dashed border-border/40 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground/60 italic inline-flex items-center gap-1 transition-colors`,
      title: "Clique para adicionar",
      children: [/*#__PURE__*/_jsx(Pencil, {
        className: "h-2.5 w-2.5"
      }), " ", placeholder]
    });
  }
  return /*#__PURE__*/_jsxs("button", {
    type: "button",
    onClick: () => setEditing(true),
    className: `text-xs px-2.5 py-0.5 rounded-full border ${colorMap} hover:brightness-125 transition-all cursor-text`,
    title: "Clique para editar",
    children: [prefix, value]
  });
}

/** Inline click-to-edit textarea: shows text/placeholder until clicked, then becomes editable. */
function ClickToEditTextarea({
  forceEditing = false,
  value,
  onChange,
  display,
  placeholder,
  rows = 4,
  emptyLabel = "Clique para adicionar",
  textareaClass
}) {
  const [localEditing, setLocalEditing] = useState(false);
  const editing = forceEditing || localEditing;
  const textareaRef = useRef(null);

  // Autofocus when entering local edit mode
  useEffect(() => {
    if (localEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [localEditing]);
  const heightCls = textareaClass ?? (rows >= 8 ? "h-64" : rows === 6 ? "h-32" : rows >= 4 ? "h-24" : "h-20");
  if (editing) {
    return /*#__PURE__*/_jsx(Textarea, {
      ref: textareaRef,
      value: value,
      onChange: e => onChange(e.target.value),
      onBlur: () => setLocalEditing(false),
      className: `bg-background/60 resize-none text-sm ${heightCls}`,
      placeholder: placeholder
    });
  }
  if (display) {
    return /*#__PURE__*/_jsx("button", {
      type: "button",
      onClick: () => setLocalEditing(true),
      className: "block w-full text-left rounded-md -m-1 p-1 transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-text",
      title: "Clique para editar",
      children: /*#__PURE__*/_jsx("p", {
        className: "text-sm leading-relaxed text-muted-foreground whitespace-pre-line",
        children: display
      })
    });
  }
  return /*#__PURE__*/_jsxs("button", {
    type: "button",
    onClick: () => setLocalEditing(true),
    className: "group flex items-center gap-2 w-full text-left rounded-md border border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/[0.04] px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-text",
    title: "Clique para adicionar",
    children: [/*#__PURE__*/_jsx(Pencil, {
      className: "h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-primary/80 transition-colors shrink-0"
    }), /*#__PURE__*/_jsx("span", {
      className: "text-xs italic text-muted-foreground/70 group-hover:text-muted-foreground transition-colors",
      children: emptyLabel
    })]
  });
}
function AbilityCard({
  raw
}) {
  const parts = raw.split(" | ");
  const nome = parts[0] ?? raw;
  const rest = parts.slice(1);
  const meta = [];
  let descricao = "";
  for (const p of rest) {
    if (p.startsWith("Nível ")) meta.push({
      value: p,
      cls: "border-primary/40 bg-primary/10 text-primary"
    });else if (p.startsWith("Custo: ")) meta.push({
      value: p.replace("Custo: ", ""),
      cls: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
    });else if (p.startsWith("Dano: ")) meta.push({
      value: p.replace("Dano: ", ""),
      cls: "border-destructive/40 bg-destructive/10 text-red-300"
    });else if (p.startsWith("Teste: ")) meta.push({
      value: p,
      cls: "border-amber-400/40 bg-amber-400/10 text-amber-300"
    });else if (p.startsWith("Alcance: ")) meta.push({
      value: p,
      cls: "border-border/40 bg-card/40 text-muted-foreground"
    });else descricao = descricao ? `${descricao} ${p}` : p;
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "p-3 rounded-lg bg-gradient-to-br from-primary/10 via-primary/[0.03] to-transparent border border-primary/20 hover:border-primary/40 transition-colors",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-start gap-2 mb-2",
      children: [/*#__PURE__*/_jsx(Zap, {
        className: "h-4 w-4 text-primary shrink-0 mt-0.5"
      }), /*#__PURE__*/_jsx("h4", {
        className: "font-semibold text-sm text-white",
        children: nome
      })]
    }), meta.length > 0 && /*#__PURE__*/_jsx("div", {
      className: "flex flex-wrap gap-1.5 mb-2",
      children: meta.map((m, mi) => /*#__PURE__*/_jsx("span", {
        className: `font-mono text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${m.cls}`,
        children: m.value
      }, mi))
    }), descricao && /*#__PURE__*/_jsx("p", {
      className: "text-xs leading-relaxed text-muted-foreground pl-6",
      children: descricao
    })]
  });
}
