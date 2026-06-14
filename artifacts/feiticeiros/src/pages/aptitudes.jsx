import { useState } from "react";
import { useListAptitudes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Scroll, ChevronDown, ChevronUp } from "lucide-react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CATEGORY_COLORS = {
  "Energia Amaldiçoada": {
    border: "border-violet-500/30",
    bg: "bg-violet-500/5",
    text: "text-violet-400",
    badge: "text-violet-400 border-violet-400/30 bg-violet-400/10"
  },
  "Controle e Leitura": {
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    text: "text-blue-400",
    badge: "text-blue-400 border-blue-400/30 bg-blue-400/10"
  },
  "Domínio": {
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    text: "text-red-400",
    badge: "text-red-400 border-red-400/30 bg-red-400/10"
  },
  "Barreira": {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    text: "text-amber-400",
    badge: "text-amber-400 border-amber-400/30 bg-amber-400/10"
  },
  "Energia Reversa": {
    border: "border-green-500/30",
    bg: "bg-green-500/5",
    text: "text-green-400",
    badge: "text-green-400 border-green-400/30 bg-green-400/10"
  },
  "Especiais": {
    border: "border-pink-500/30",
    bg: "bg-pink-500/5",
    text: "text-pink-400",
    badge: "text-pink-400 border-pink-400/30 bg-pink-400/10"
  }
};
function AptitudeCard({
  apt
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = CATEGORY_COLORS[apt.category] || {
    border: "border-border/40",
    bg: "bg-card/20",
    text: "text-muted-foreground",
    badge: "text-muted-foreground border-border/40"
  };
  return /*#__PURE__*/_jsxs("div", {
    className: `rounded-lg border ${colors.border} ${colors.bg} transition-all cursor-pointer`,
    onClick: () => setExpanded(!expanded),
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between p-3 gap-3",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3 flex-1 min-w-0",
        children: [/*#__PURE__*/_jsx("div", {
          className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${colors.border} ${colors.text}`,
          children: apt.level
        }), /*#__PURE__*/_jsx("span", {
          className: "font-medium text-sm",
          children: apt.name
        }), apt.prerequisite && /*#__PURE__*/_jsxs("span", {
          className: "text-xs text-muted-foreground hidden sm:inline truncate",
          children: ["Req: ", apt.prerequisite]
        })]
      }), expanded ? /*#__PURE__*/_jsx(ChevronUp, {
        className: "h-4 w-4 text-muted-foreground shrink-0"
      }) : /*#__PURE__*/_jsx(ChevronDown, {
        className: "h-4 w-4 text-muted-foreground shrink-0"
      })]
    }), expanded && /*#__PURE__*/_jsxs("div", {
      className: "px-3 pb-3 space-y-2",
      children: [/*#__PURE__*/_jsx("p", {
        className: "text-sm text-muted-foreground leading-relaxed",
        children: apt.description
      }), apt.prerequisite && /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-1.5 text-xs text-muted-foreground",
        children: [/*#__PURE__*/_jsx("span", {
          className: "font-medium",
          children: "Pr\xE9-requisito:"
        }), /*#__PURE__*/_jsx("span", {
          children: apt.prerequisite
        })]
      })]
    })]
  });
}
export default function Aptitudes() {
  const {
    data: aptitudes,
    isLoading
  } = useListAptitudes();
  const byCategory = aptitudes?.reduce((acc, apt) => {
    if (!acc[apt.category]) acc[apt.category] = [];
    acc[apt.category].push(apt);
    return acc;
  }, {});
  const categoryOrder = ["Energia Amaldiçoada", "Controle e Leitura", "Domínio", "Barreira", "Energia Reversa", "Especiais"];
  const sorted = byCategory ? categoryOrder.filter(c => byCategory[c]).map(c => ({
    category: c,
    apts: byCategory[c]
  })) : [];
  return /*#__PURE__*/_jsxs("div", {
    className: "space-y-6 animate-in fade-in duration-500",
    children: [/*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("h1", {
        className: "text-3xl font-bold tracking-tight",
        children: "Aptid\xF5es Amaldi\xE7oadas"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-muted-foreground mt-1",
        children: "Cat\xE1logo de aptid\xF5es do sistema \u2014 clique em uma aptid\xE3o para ver os detalhes."
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "flex flex-wrap gap-2",
      children: categoryOrder.map(cat => {
        const colors = CATEGORY_COLORS[cat];
        return /*#__PURE__*/_jsx("span", {
          className: `text-xs px-2.5 py-1 rounded-full border font-medium ${colors?.badge}`,
          children: cat
        }, cat);
      })
    }), isLoading ? /*#__PURE__*/_jsx("div", {
      className: "space-y-8",
      children: [1, 2, 3].map(i => /*#__PURE__*/_jsxs("div", {
        className: "space-y-3",
        children: [/*#__PURE__*/_jsx(Skeleton, {
          className: "h-6 w-48"
        }), /*#__PURE__*/_jsx("div", {
          className: "space-y-2",
          children: [1, 2, 3].map(j => /*#__PURE__*/_jsx(Skeleton, {
            className: "h-12 rounded-lg"
          }, j))
        })]
      }, i))
    }) : sorted.length > 0 ? /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
      children: sorted.map(({
        category,
        apts
      }) => {
        const colors = CATEGORY_COLORS[category] || {
          text: "text-muted-foreground"
        };
        return /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/30",
          children: [/*#__PURE__*/_jsx(CardHeader, {
            className: "pb-3 border-b border-border/30",
            children: /*#__PURE__*/_jsxs(CardTitle, {
              className: `text-base flex items-center gap-2 ${colors.text}`,
              children: [/*#__PURE__*/_jsx(Scroll, {
                className: "h-4 w-4"
              }), category, /*#__PURE__*/_jsxs(Badge, {
                variant: "outline",
                className: "ml-auto text-xs font-normal text-muted-foreground",
                children: [apts.length, " aptid\xF5es"]
              })]
            })
          }), /*#__PURE__*/_jsx(CardContent, {
            className: "pt-4 space-y-2",
            children: apts.map(apt => /*#__PURE__*/_jsx(AptitudeCard, {
              apt: apt
            }, apt.id))
          })]
        }, category);
      })
    }) : /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-card/20 border-dashed border-border",
      children: [/*#__PURE__*/_jsx(Scroll, {
        className: "h-12 w-12 text-muted-foreground mb-4 opacity-20"
      }), /*#__PURE__*/_jsx("p", {
        className: "text-lg font-medium",
        children: "Nenhuma aptid\xE3o encontrada."
      }), /*#__PURE__*/_jsx("p", {
        className: "text-sm text-muted-foreground mt-1",
        children: "As aptid\xF5es ser\xE3o carregadas em breve."
      })]
    })]
  });
}
