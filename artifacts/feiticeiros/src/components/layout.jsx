import { Link, useLocation } from "wouter";
import { Users, BookOpen, ScrollText, PlusCircle, Menu, Sparkles, Home, Cat, Target, Skull, Scroll, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CursedBackground } from "./cursed-background";
import { CursedLogo } from "./cursed-logo";
import { DiceRoller } from "./dice-roller";
import { Show, useUser, useClerk } from "@clerk/react";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const navigation = [{
  name: "Início",
  href: "/",
  icon: Home
}, {
  name: "Fichas",
  href: "/dashboard",
  icon: Users
}, {
  name: "Nova Ficha",
  href: "/fichas/nova",
  icon: PlusCircle
}, {
  name: "Técnicas",
  href: "/tecnicas",
  icon: BookOpen
}, {
  name: "Aptidões",
  href: "/aptidoes",
  icon: ScrollText
}, {
  name: "Shikigamis",
  href: "/shikigamis",
  icon: Cat
}, {
  name: "Domínios",
  href: "/dominios",
  icon: Target
}];
const masterNavigation = [{
  name: "Bosses",
  href: "/bosses",
  icon: Skull
}, {
  name: "Campanhas",
  href: "/campanhas",
  icon: Scroll
}];
function isRouteActive(location, href) {
  if (href === "/") return location === "/";
  return location === href || location.startsWith(href + "/");
}
export function Layout({
  children
}) {
  const [location] = useLocation();
  const renderNavItem = (item, onSelect, accent = "primary") => {
    const isActive = isRouteActive(location, item.href);
    const activeBg = accent === "destructive" ? "text-white bg-gradient-to-r from-destructive/30 via-destructive/10 to-transparent border border-destructive/40 shadow-[0_0_18px_hsl(355_80%_52%_/_0.25)]" : "text-white bg-gradient-to-r from-primary/30 via-primary/10 to-transparent border border-primary/40 shadow-[0_0_18px_hsl(265_85%_62%_/_0.25)]";
    const idleBg = accent === "destructive" ? "text-muted-foreground hover:text-white hover:bg-destructive/5 border border-transparent hover:border-destructive/20" : "text-muted-foreground hover:text-white hover:bg-primary/5 border border-transparent hover:border-primary/20";
    const activeBar = accent === "destructive" ? "bg-gradient-to-b from-transparent via-destructive to-transparent shadow-[0_0_8px_hsl(355_80%_52%)]" : "bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_8px_hsl(265_85%_62%)]";
    const iconActive = accent === "destructive" ? "text-destructive drop-shadow-[0_0_6px_hsl(355_80%_52%)]" : "text-primary drop-shadow-[0_0_6px_hsl(265_85%_62%)]";
    const iconHover = accent === "destructive" ? "group-hover:text-destructive" : "group-hover:text-primary";
    return /*#__PURE__*/_jsx(Link, {
      href: item.href,
      onClick: onSelect,
      children: /*#__PURE__*/_jsxs("span", {
        className: `group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all cursor-pointer overflow-hidden ${isActive ? activeBg : idleBg}`,
        children: [isActive && /*#__PURE__*/_jsx("span", {
          className: `absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] ${activeBar}`
        }), /*#__PURE__*/_jsx(item.icon, {
          className: `h-4 w-4 transition-all ${isActive ? iconActive : iconHover}`
        }), /*#__PURE__*/_jsx("span", {
          className: "tracking-wide",
          children: item.name
        }), isActive && /*#__PURE__*/_jsx(Sparkles, {
          className: `ml-auto h-3 w-3 animate-pulse ${accent === "destructive" ? "text-destructive" : "text-primary"}`
        })]
      })
    }, item.name);
  };
  const NavItems = ({
    onSelect
  }) => /*#__PURE__*/_jsxs(_Fragment, {
    children: [navigation.map(item => renderNavItem(item, onSelect, "primary")), /*#__PURE__*/_jsxs("div", {
      className: "mt-4 mb-1 px-3 flex items-center gap-2",
      children: [/*#__PURE__*/_jsx("span", {
        className: "font-jp text-[10px] tracking-[0.4em] text-destructive/70",
        children: "\u8853\u5E2B"
      }), /*#__PURE__*/_jsx("span", {
        className: "h-px flex-1 bg-destructive/20"
      }), /*#__PURE__*/_jsx("span", {
        className: "text-[9px] uppercase tracking-[0.3em] text-muted-foreground/80",
        children: "Mestre"
      })]
    }), masterNavigation.map(item => renderNavItem(item, onSelect, "destructive"))]
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "relative min-h-screen w-full bg-background text-foreground overflow-hidden",
    children: [/*#__PURE__*/_jsx(CursedBackground, {}), /*#__PURE__*/_jsxs("div", {
      className: "relative z-10 flex min-h-screen w-full flex-col",
      children: [/*#__PURE__*/_jsxs("header", {
        className: "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-primary/15 glass px-4 sm:px-6",
        children: [/*#__PURE__*/_jsxs(Sheet, {
          children: [/*#__PURE__*/_jsx(SheetTrigger, {
            asChild: true,
            children: /*#__PURE__*/_jsxs(Button, {
              variant: "outline",
              size: "icon",
              className: "shrink-0 md:hidden border-primary/30 bg-background/40 hover:bg-primary/10 hover:border-primary/50",
              children: [/*#__PURE__*/_jsx(Menu, {
                className: "h-5 w-5"
              }), /*#__PURE__*/_jsx("span", {
                className: "sr-only",
                children: "Menu"
              })]
            })
          }), /*#__PURE__*/_jsxs(SheetContent, {
            side: "left",
            className: "w-72 glass-strong border-r border-primary/20",
            children: [/*#__PURE__*/_jsx(Link, {
              href: "/",
              children: /*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-2 cursor-pointer mb-8 mt-2",
                children: [/*#__PURE__*/_jsx(CursedLogo, {
                  size: 32
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex flex-col leading-tight",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "font-display text-base font-bold text-cursed",
                    children: "Feiticeiros"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
                    children: "& Maldi\xE7\xF5es"
                  })]
                })]
              })
            }), /*#__PURE__*/_jsx("nav", {
              className: "grid gap-1.5",
              children: /*#__PURE__*/_jsx(NavItems, {})
            })]
          })]
        }), /*#__PURE__*/_jsx(Link, {
          href: "/",
          children: /*#__PURE__*/_jsxs("span", {
            className: "flex items-center gap-3 cursor-pointer group",
            children: [/*#__PURE__*/_jsx("span", {
              className: "relative",
              children: /*#__PURE__*/_jsx(CursedLogo, {
                size: 34,
                className: "transition-transform duration-500 group-hover:rotate-180"
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "hidden md:flex flex-col leading-tight",
              children: [/*#__PURE__*/_jsx("span", {
                className: "font-display text-base font-bold tracking-wider text-cursed",
                children: "FEITICEIROS"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-[10px] uppercase tracking-[0.35em] text-muted-foreground",
                children: "& Maldi\xE7\xF5es"
              })]
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "ml-auto hidden sm:flex items-center gap-3 text-muted-foreground/60",
          children: [/*#__PURE__*/_jsx("span", {
            className: "font-jp text-xs tracking-widest",
            children: "\u546A\u8853\u5E2B"
          }), /*#__PURE__*/_jsx("span", {
            className: "h-4 w-px bg-primary/30"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-[10px] uppercase tracking-[0.3em]",
            children: "Sistema de Fichas"
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "ml-auto sm:ml-4 flex items-center",
          children: /*#__PURE__*/_jsx(AuthMenu, {})
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex flex-1",
        children: [/*#__PURE__*/_jsxs("aside", {
          className: "hidden w-60 border-r border-primary/15 glass md:flex md:flex-col",
          children: [/*#__PURE__*/_jsx("nav", {
            className: "grid gap-1.5 p-3 text-sm",
            children: /*#__PURE__*/_jsx(NavItems, {})
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-auto p-4 border-t border-primary/10",
            children: /*#__PURE__*/_jsxs("div", {
              className: "rounded-md glass p-3 text-[11px] leading-relaxed text-muted-foreground",
              children: [/*#__PURE__*/_jsx("div", {
                className: "font-jp text-primary mb-1 text-glow-violet",
                children: "\u546A\u3044"
              }), /*#__PURE__*/_jsx("p", {
                className: "italic",
                children: "\"A energia amaldi\xE7oada nasce das emo\xE7\xF5es negativas dos humanos.\""
              })]
            })
          })]
        }), /*#__PURE__*/_jsx("main", {
          className: "flex-1 p-4 md:p-8",
          children: /*#__PURE__*/_jsx("div", {
            className: "mx-auto max-w-7xl animate-flicker",
            children: children
          })
        })]
      })]
    }), /*#__PURE__*/_jsx(DiceRoller, {})]
  });
}
function AuthMenu() {
  const {
    user
  } = useUser();
  const {
    signOut
  } = useClerk();
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(Show, {
      when: "signed-out",
      children: /*#__PURE__*/_jsx(Link, {
        href: "/sign-in",
        children: /*#__PURE__*/_jsxs(Button, {
          size: "sm",
          className: "gap-2 bg-gradient-to-r from-primary to-purple-700 hover:from-primary hover:to-purple-600 border border-primary/50 shadow-[0_0_14px_hsl(265_85%_62%_/_0.4)] text-white font-display tracking-wider",
          children: [/*#__PURE__*/_jsx(LogIn, {
            className: "h-4 w-4"
          }), "Entrar"]
        })
      })
    }), /*#__PURE__*/_jsx(Show, {
      when: "signed-in",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-3",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-primary/20",
          children: [/*#__PURE__*/_jsx("div", {
            className: "h-7 w-7 rounded-full bg-gradient-to-br from-primary/40 to-destructive/30 border border-primary/40 flex items-center justify-center text-xs font-display font-bold text-white",
            children: (user?.firstName?.charAt(0) || user?.primaryEmailAddress?.emailAddress?.charAt(0) || "F").toUpperCase()
          }), /*#__PURE__*/_jsx("span", {
            className: "text-xs text-muted-foreground max-w-[150px] truncate",
            children: user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Feiticeiro"
          })]
        }), /*#__PURE__*/_jsxs(Button, {
          variant: "ghost",
          size: "sm",
          onClick: () => signOut({
            redirectUrl: basePath || "/"
          }),
          className: "gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
          title: "Sair",
          children: [/*#__PURE__*/_jsx(LogOut, {
            className: "h-4 w-4"
          }), /*#__PURE__*/_jsx("span", {
            className: "hidden md:inline",
            children: "Sair"
          })]
        })]
      })
    })]
  });
}

// Suppress unused import warnings — UserIcon kept for potential future use
void UserIcon;
