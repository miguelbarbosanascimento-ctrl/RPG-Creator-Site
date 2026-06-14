import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CharacterForm from "@/pages/character-form";
import CharacterSheet from "@/pages/character-sheet";
import Techniques from "@/pages/techniques";
import Aptitudes from "@/pages/aptitudes";
import Shikigamis from "@/pages/shikigamis";
import Domains from "@/pages/domains";
import Bosses from "@/pages/bosses";
import Campaigns from "@/pages/campaigns";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const queryClient = new QueryClient();
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
function stripBase(path) {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}
if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}
const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside",
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`
  },
  variables: {
    colorPrimary: "hsl(265 85% 62%)",
    colorForeground: "hsl(0 0% 96%)",
    colorMutedForeground: "hsl(0 0% 65%)",
    colorDanger: "hsl(355 80% 52%)",
    colorBackground: "hsl(260 25% 8%)",
    colorInput: "hsl(260 25% 12%)",
    colorInputForeground: "hsl(0 0% 96%)",
    colorNeutral: "hsl(265 30% 30%)",
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: "0.5rem"
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card/95 backdrop-blur rounded-xl w-[440px] max-w-full overflow-hidden border border-primary/30 shadow-[0_0_60px_hsl(265_85%_62%_/_0.35)]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-display text-2xl tracking-wider text-white",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "text-white",
    socialButtonsBlockButton: "border-primary/30 bg-background/40 hover:bg-primary/10 hover:border-primary/60 text-white",
    formFieldLabel: "text-foreground/90",
    formFieldInput: "bg-background/60 border-primary/20 text-foreground",
    formButtonPrimary: "bg-gradient-to-r from-primary to-purple-700 hover:from-primary hover:to-purple-600 border border-primary/50 shadow-[0_0_20px_hsl(265_85%_62%_/_0.5)] text-white font-display tracking-wider",
    footerActionLink: "text-primary hover:text-primary/80",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    dividerLine: "bg-primary/20",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-emerald-400",
    alert: "bg-destructive/10 border border-destructive/40",
    alertText: "text-destructive-foreground",
    otpCodeFieldInput: "bg-background/60 border-primary/20 text-foreground",
    logoBox: "justify-center mb-2",
    logoImage: "h-12 w-12",
    main: "gap-4"
  }
};
function SignInPage() {
  return /*#__PURE__*/_jsxs("div", {
    className: "flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(265_85%_62%_/_0.18),transparent_60%),radial-gradient(circle_at_70%_70%,hsl(355_80%_52%_/_0.12),transparent_55%)]"
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 opacity-[0.04] [background-image:linear-gradient(hsl(265_85%_62%)_1px,transparent_1px),linear-gradient(90deg,hsl(265_85%_62%)_1px,transparent_1px)] [background-size:40px_40px]"
    }), /*#__PURE__*/_jsx("div", {
      className: "relative",
      children: /*#__PURE__*/_jsx(SignIn, {
        routing: "path",
        path: `${basePath}/sign-in`,
        signUpUrl: `${basePath}/sign-up`
      })
    })]
  });
}
function SignUpPage() {
  return /*#__PURE__*/_jsxs("div", {
    className: "flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden",
    children: [/*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(265_85%_62%_/_0.18),transparent_60%),radial-gradient(circle_at_70%_70%,hsl(355_80%_52%_/_0.12),transparent_55%)]"
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 opacity-[0.04] [background-image:linear-gradient(hsl(265_85%_62%)_1px,transparent_1px),linear-gradient(90deg,hsl(265_85%_62%)_1px,transparent_1px)] [background-size:40px_40px]"
    }), /*#__PURE__*/_jsx("div", {
      className: "relative",
      children: /*#__PURE__*/_jsx(SignUp, {
        routing: "path",
        path: `${basePath}/sign-up`,
        signInUrl: `${basePath}/sign-in`
      })
    })]
  });
}
function RequireAuth({
  children
}) {
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(Show, {
      when: "signed-in",
      children: children
    }), /*#__PURE__*/_jsx(Show, {
      when: "signed-out",
      children: /*#__PURE__*/_jsx(Redirect, {
        to: "/sign-in"
      })
    })]
  });
}
function ClerkQueryClientCacheInvalidator() {
  const {
    addListener
  } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({
      user
    }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);
  return null;
}
function AppRoutes() {
  return /*#__PURE__*/_jsxs(Switch, {
    children: [/*#__PURE__*/_jsx(Route, {
      path: "/sign-in/*?",
      component: SignInPage
    }), /*#__PURE__*/_jsx(Route, {
      path: "/sign-up/*?",
      component: SignUpPage
    }), /*#__PURE__*/_jsx(Route, {
      children: /*#__PURE__*/_jsx(Layout, {
        children: /*#__PURE__*/_jsxs(Switch, {
          children: [/*#__PURE__*/_jsx(Route, {
            path: "/",
            component: Landing
          }), /*#__PURE__*/_jsx(Route, {
            path: "/dashboard",
            children: /*#__PURE__*/_jsx(RequireAuth, {
              children: /*#__PURE__*/_jsx(Dashboard, {})
            })
          }), /*#__PURE__*/_jsx(Route, {
            path: "/fichas/nova",
            children: /*#__PURE__*/_jsx(RequireAuth, {
              children: /*#__PURE__*/_jsx(CharacterForm, {})
            })
          }), /*#__PURE__*/_jsx(Route, {
            path: "/fichas/:id",
            children: /*#__PURE__*/_jsx(RequireAuth, {
              children: /*#__PURE__*/_jsx(CharacterSheet, {})
            })
          }), /*#__PURE__*/_jsx(Route, {
            path: "/tecnicas",
            component: Techniques
          }), /*#__PURE__*/_jsx(Route, {
            path: "/aptidoes",
            component: Aptitudes
          }), /*#__PURE__*/_jsx(Route, {
            path: "/shikigamis",
            children: /*#__PURE__*/_jsx(RequireAuth, {
              children: /*#__PURE__*/_jsx(Shikigamis, {})
            })
          }), /*#__PURE__*/_jsx(Route, {
            path: "/dominios",
            children: /*#__PURE__*/_jsx(RequireAuth, {
              children: /*#__PURE__*/_jsx(Domains, {})
            })
          }), /*#__PURE__*/_jsx(Route, {
            path: "/bosses",
            children: /*#__PURE__*/_jsx(RequireAuth, {
              children: /*#__PURE__*/_jsx(Bosses, {})
            })
          }), /*#__PURE__*/_jsx(Route, {
            path: "/campanhas",
            children: /*#__PURE__*/_jsx(RequireAuth, {
              children: /*#__PURE__*/_jsx(Campaigns, {})
            })
          }), /*#__PURE__*/_jsx(Route, {
            component: NotFound
          })]
        })
      })
    })]
  });
}
function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return /*#__PURE__*/_jsx(ClerkProvider, {
    publishableKey: clerkPubKey,
    proxyUrl: clerkProxyUrl,
    appearance: clerkAppearance,
    signInUrl: `${basePath}/sign-in`,
    signUpUrl: `${basePath}/sign-up`,
    localization: {
      signIn: {
        start: {
          title: "Bem-vindo de volta, feiticeiro",
          subtitle: "Entre para acessar suas fichas"
        }
      },
      signUp: {
        start: {
          title: "Você quer fazer um vínculo?",
          subtitle: "Crie sua conta para começar"
        }
      }
    },
    routerPush: to => setLocation(stripBase(to)),
    routerReplace: to => setLocation(stripBase(to), {
      replace: true
    }),
    children: /*#__PURE__*/_jsxs(QueryClientProvider, {
      client: queryClient,
      children: [/*#__PURE__*/_jsx(ClerkQueryClientCacheInvalidator, {}), /*#__PURE__*/_jsxs(TooltipProvider, {
        children: [/*#__PURE__*/_jsx(AppRoutes, {}), /*#__PURE__*/_jsx(Toaster, {})]
      })]
    })
  });
}
function App() {
  return /*#__PURE__*/_jsx(WouterRouter, {
    base: basePath,
    children: /*#__PURE__*/_jsx(ClerkProviderWithRoutes, {})
  });
}
export default App;
