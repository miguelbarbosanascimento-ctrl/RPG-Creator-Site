import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateCharacter, useListTechniques } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Save, User, Swords, Zap, Scroll, Package, Plus, X } from "lucide-react";
import { AtributosHexagon } from "@/components/atributos";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ORIGENS = ["Feiticeiro Jujutsu", "Usuário de Maldição", "Maldição Desperta", "Semi-Maldição", "Maldição Encarnada", "Caçador"];
const CLANS = ["Nenhuma", "Gojo", "Zenin", "Kamo", "Inumaki", "Outro"];
const ESPECIALIZACOES = ["Lutador", "Especialista em Técnica", "Especialista em Combate", "Médico", "Estrategista", "Elementalista", "Invocador", "Manipulador", "Guardião"];
const GRAUS = ["4° Grau", "3° Grau", "2° Grau", "1° Grau", "Semi-Grau Especial", "Grau Especial"];
const APTIDOES_DISPONIVEIS = [{
  id: "reforco",
  nome: "Reforço Amaldiçoado",
  categoria: "Energia Amaldiçoada"
}, {
  id: "cura-ea",
  nome: "Cura Amaldiçoada",
  categoria: "Energia Amaldiçoada"
}, {
  id: "armamento",
  nome: "Armamento Amaldiçoado",
  categoria: "Energia Amaldiçoada"
}, {
  id: "sensibilidade",
  nome: "Sensibilidade Amaldiçoada",
  categoria: "Controle e Leitura"
}, {
  id: "leitura",
  nome: "Leitura de Técnica",
  categoria: "Controle e Leitura"
}, {
  id: "controle",
  nome: "Controle Refinado",
  categoria: "Controle e Leitura"
}, {
  id: "dominio-1",
  nome: "Aptidão de Domínio I",
  categoria: "Domínio"
}, {
  id: "dominio-2",
  nome: "Aptidão de Domínio II",
  categoria: "Domínio"
}, {
  id: "dominio-3",
  nome: "Aptidão de Domínio III",
  categoria: "Domínio"
}, {
  id: "barreira-1",
  nome: "Barreira Simples",
  categoria: "Barreira"
}, {
  id: "barreira-2",
  nome: "Barreira Refinada",
  categoria: "Barreira"
}, {
  id: "barreira-3",
  nome: "Barreira de Captura",
  categoria: "Barreira"
}, {
  id: "reversa-1",
  nome: "Cura Reversa I",
  categoria: "Energia Reversa"
}, {
  id: "reversa-2",
  nome: "Cura Reversa II",
  categoria: "Energia Reversa"
}, {
  id: "reversa-3",
  nome: "Técnica Reversa",
  categoria: "Energia Reversa"
}, {
  id: "voto",
  nome: "Voto de Restrição",
  categoria: "Especiais"
}, {
  id: "liberacao",
  nome: "Liberação Máxima",
  categoria: "Especiais"
}];

// Perícias: nome, atributo associado, carga (penalidade), somenteTreinada
const PERICIAS = [{
  nome: "Acrobacia",
  atributo: "DEX",
  carga: true,
  somenteTreinada: false
}, {
  nome: "Adestramento",
  atributo: "CAR",
  carga: false,
  somenteTreinada: true
}, {
  nome: "Arcanismo",
  atributo: "INT",
  carga: false,
  somenteTreinada: true
}, {
  nome: "Atletismo",
  atributo: "FOR",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Atuação",
  atributo: "CAR",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Ciências",
  atributo: "INT",
  carga: false,
  somenteTreinada: true
}, {
  nome: "Crime",
  atributo: "DEX",
  carga: true,
  somenteTreinada: true
}, {
  nome: "Diplomacia",
  atributo: "CAR",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Enganação",
  atributo: "CAR",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Fortitude",
  atributo: "CON",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Furtividade",
  atributo: "DEX",
  carga: true,
  somenteTreinada: false
}, {
  nome: "Iniciativa",
  atributo: "DEX",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Intimidação",
  atributo: "CAR",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Intuição",
  atributo: "SAB",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Investigação",
  atributo: "INT",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Luta",
  atributo: "FOR",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Medicina",
  atributo: "INT",
  carga: false,
  somenteTreinada: true
}, {
  nome: "Ocultismo",
  atributo: "INT",
  carga: false,
  somenteTreinada: true
}, {
  nome: "Percepção",
  atributo: "SAB",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Pontaria",
  atributo: "DEX",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Reflexos",
  atributo: "DEX",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Religião",
  atributo: "SAB",
  carga: false,
  somenteTreinada: true
}, {
  nome: "Sobrevivência",
  atributo: "SAB",
  carga: false,
  somenteTreinada: false
}, {
  nome: "Tática",
  atributo: "INT",
  carga: false,
  somenteTreinada: true
}, {
  nome: "Vontade",
  atributo: "SAB",
  carga: false,
  somenteTreinada: false
}];

// Equipamentos do Livro Básico de Feiticeiros e Maldições
const EQUIPAMENTOS_PRESET = [{
  categoria: "Armas Corpo-a-Corpo",
  itens: [{
    nome: "Catana",
    buff: "Dano 1d10 cortante. Versátil."
  }, {
    nome: "Catana Amaldiçoada",
    buff: "Dano 1d10 cortante. Pode imbuir energia amaldiçoada para +1d6."
  }, {
    nome: "Martelo",
    buff: "Dano 1d8 contundente. Versátil."
  }, {
    nome: "Lança",
    buff: "Dano 1d6 perfurante. Alcance estendido."
  }, {
    nome: "Adaga",
    buff: "Dano 1d4 perfurante. Leve, arremessável."
  }, {
    nome: "Tonfa",
    buff: "Dano 1d6 contundente. +1 em testes de defesa."
  }, {
    nome: "Bastão Bo",
    buff: "Dano 1d8 contundente. Duas mãos."
  }, {
    nome: "Nunchaku",
    buff: "Dano 1d6 contundente. +1 iniciativa."
  }, {
    nome: "Espada Longa",
    buff: "Dano 1d10 cortante. Versátil 1d12 com duas mãos."
  }, {
    nome: "Espada Curta",
    buff: "Dano 1d6 perfurante. Acuidade."
  }]
}, {
  categoria: "Armas à Distância",
  itens: [{
    nome: "Arco Longo",
    buff: "Dano 1d8 perfurante. Alcance 36m."
  }, {
    nome: "Besta de Mão",
    buff: "Dano 1d6 perfurante. Recarga."
  }, {
    nome: "Pistola",
    buff: "Dano 2d6 perfurante. Alcance 18m."
  }, {
    nome: "Rifle",
    buff: "Dano 2d10 perfurante. Alcance 90m. Duas mãos."
  }, {
    nome: "Pregos Amaldiçoados (10)",
    buff: "Munição para Boneco de Palha. Causa 1d8 por prego."
  }]
}, {
  categoria: "Uniformes e Armaduras",
  itens: [{
    nome: "Uniforme de Feiticeiro",
    buff: "CA 11 + DEX. Sem penalidade."
  }, {
    nome: "Uniforme Reforçado",
    buff: "CA 12 + DEX (máx +3). Resistência leve a dano físico."
  }, {
    nome: "Armadura Leve",
    buff: "CA 13 + DEX (máx +2). +1 em testes de Fortitude."
  }, {
    nome: "Uniforme Cerimonial",
    buff: "CA 10 + DEX. +2 em testes de Diplomacia e Persuasão."
  }]
}, {
  categoria: "Escudos",
  itens: [{
    nome: "Escudo Pequeno",
    buff: "+1 CA. Permite uso de arma de uma mão."
  }, {
    nome: "Escudo Grande",
    buff: "+2 CA. Reduz movimento em 1,5m."
  }, {
    nome: "Escudo Amaldiçoado",
    buff: "+2 CA. Pode bloquear 1 técnica/dia."
  }]
}, {
  categoria: "Ferramentas Amaldiçoadas",
  itens: [{
    nome: "Papel Selado",
    buff: "Permite armazenar 1 técnica para uso posterior."
  }, {
    nome: "Talismã de Proteção",
    buff: "+1 em testes de resistência contra técnicas."
  }, {
    nome: "Sal Amaldiçoado",
    buff: "Repele maldições de 4° grau. 5 doses."
  }, {
    nome: "Amuleto de Barreira",
    buff: "Cria barreira de 1,5m por 1 turno. 1 uso/dia."
  }, {
    nome: "Anel da Concentração",
    buff: "+1 em testes de Vontade e Controle."
  }, {
    nome: "Bracelete Amaldiçoado",
    buff: "Armazena 5 PE adicionais que recarregam a cada descanso longo."
  }, {
    nome: "Boneco de Palha",
    buff: "Componente obrigatório da técnica Boneco de Palha."
  }]
}, {
  categoria: "Kits e Suprimentos",
  itens: [{
    nome: "Kit Médico",
    buff: "Permite estabilizar feridos e curar 1d4 PV (3 usos)."
  }, {
    nome: "Kit de Ladrão",
    buff: "+2 em testes de Crime para abrir fechaduras."
  }, {
    nome: "Kit de Disfarce",
    buff: "+2 em testes de Dissimulação."
  }, {
    nome: "Mochila Aventureira",
    buff: "Comporta itens essenciais para uma missão."
  }, {
    nome: "Lanterna",
    buff: "Ilumina até 6m. Bateria dura 8h."
  }, {
    nome: "Corda de 15m",
    buff: "Resistente, suporta até 200kg."
  }, {
    nome: "Rações de Viagem (5)",
    buff: "Alimento para 5 dias."
  }]
}];
function calcModifier(score) {
  return score;
}
function fmtMod(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
// Cor escalonada por valor de treino: 0 cinza, 5 verde, 10 azul, 15 vermelho, 20 roxo, 25 branco
function trainingColor(value) {
  if (value >= 25) return "text-white";
  if (value >= 20) return "text-purple-400";
  if (value >= 15) return "text-red-400";
  if (value >= 10) return "text-blue-400";
  if (value >= 5) return "text-green-400";
  return "text-muted-foreground/60";
}
export default function CharacterForm() {
  const [, navigate] = useLocation();
  const {
    toast
  } = useToast();
  const {
    mutate: createCharacter,
    isPending
  } = useCreateCharacter();
  const {
    data: techniques
  } = useListTechniques();
  const [activeTab, setActiveTab] = useState("identidade");
  const [form, setForm] = useState({
    name: "",
    level: 1,
    origin: "",
    clanHeritage: "Nenhuma",
    clanCustom: "",
    specializations: [],
    grade: "4° Grau",
    backstory: "",
    personality: "",
    technique: "",
    technique_description: "",
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
    armorClass: 10,
    selectedAptitudes: [],
    skillsMap: {},
    equipmentItems: [],
    equipmentCategory: "",
    customEquipment: {
      nome: "",
      buff: ""
    },
    abilities: [],
    customStats: [],
    notes: ""
  });
  const set = (field, value) => setForm(prev => ({
    ...prev,
    [field]: value
  }));
  const toggleAptitude = nome => {
    setForm(prev => ({
      ...prev,
      selectedAptitudes: prev.selectedAptitudes.includes(nome) ? prev.selectedAptitudes.filter(a => a !== nome) : [...prev.selectedAptitudes, nome]
    }));
  };
  const toggleSpecialization = esp => {
    setForm(prev => ({
      ...prev,
      specializations: prev.specializations.includes(esp) ? prev.specializations.filter(s => s !== esp) : [...prev.specializations, esp]
    }));
  };
  const getAtributoValor = abbr => {
    switch (abbr) {
      case "FOR":
        return form.strength;
      case "DEX":
        return form.dexterity;
      case "CON":
        return form.constitution;
      case "INT":
        return form.intelligence;
      case "SAB":
        return form.wisdom;
      case "CAR":
        return form.charisma;
      default:
        return 1;
    }
  };
  const masteryBonus = Math.ceil((form.level + 3) / 4);
  const calcBonusPericia = pericia => {
    const state = form.skillsMap[pericia.nome];
    const treinada = state?.treinada ?? false;
    const outros = state?.outros ?? 0;
    const atrMod = calcModifier(getAtributoValor(pericia.atributo));
    return atrMod + (treinada ? masteryBonus : 0) + outros;
  };
  const setSkill = (nome, partial) => {
    setForm(prev => ({
      ...prev,
      skillsMap: {
        ...prev.skillsMap,
        [nome]: {
          treinada: prev.skillsMap[nome]?.treinada ?? false,
          outros: prev.skillsMap[nome]?.outros ?? 0,
          ...partial
        }
      }
    }));
  };
  const addAbility = preset => {
    setForm(prev => ({
      ...prev,
      abilities: [...prev.abilities, {
        nome: "",
        nivel: "0",
        conjuracao: "Ação Comum",
        alcance: "",
        alvo: "",
        duracao: "Imediata",
        custoEnergia: "0",
        dano: "",
        tipoDano: "",
        teste: "",
        descricao: "",
        ...preset
      }]
    }));
  };
  const UNIVERSAL_PRESETS = [{
    label: "Reforço de Energia Amaldiçoada",
    data: {
      nome: "Reforço de Energia Amaldiçoada",
      nivel: "1",
      conjuracao: "Ação Bônus",
      alcance: "Pessoal",
      alvo: "Si mesmo",
      duracao: "3 turnos",
      custoEnergia: "2",
      dano: "+1d6",
      tipoDano: "",
      teste: "",
      descricao: "Reveste o corpo em energia amaldiçoada. +1d6 de dano físico e +2 em CA por 3 turnos. Base do combate corpo a corpo de feiticeiros."
    }
  }, {
    label: "Lampejo Negro (Black Flash)",
    data: {
      nome: "Lampejo Negro (Black Flash)",
      nivel: "2",
      conjuracao: "Ação Comum",
      alcance: "Corpo a corpo",
      alvo: "Uma criatura",
      duracao: "Imediata",
      custoEnergia: "3",
      dano: "Ataque base × 2.5",
      tipoDano: "Contundente",
      teste: "Rolar 1d20: 18+ é Lampejo",
      descricao: "Acerto crítico espacial. Aplica energia amaldiçoada no impacto físico dentro de uma janela menor que 0.000001s. Em 1d20 ≥ 18, dano é multiplicado por 2.5. Quatro Lampejos seguidos colocam o usuário no Zone (próximos 3 ataques são Lampejos garantidos)."
    }
  }, {
    label: "Técnica Reversa (RCE)",
    data: {
      nome: "Técnica Amaldiçoada Reversa",
      nivel: "3",
      conjuracao: "Ação Comum",
      alcance: "Toque",
      alvo: "Si mesmo ou aliado",
      duracao: "Imediata",
      custoEnergia: "4",
      dano: "Cura 6d8",
      tipoDano: "",
      teste: "",
      descricao: "Inverte a polaridade da energia negativa para gerar energia positiva. Cura 6d8 PV e remove uma condição negativa menor. Único método sobrenatural de cura disponível para feiticeiros."
    }
  }, {
    label: "Expansão de Domínio",
    data: {
      nome: "Expansão de Domínio",
      nivel: "5",
      conjuracao: "Ação Comum",
      alcance: "Cúpula de 15-25m",
      alvo: "Todos no domínio",
      duracao: "3 turnos",
      custoEnergia: "10",
      dano: "8d10 a 12d12",
      tipoDano: "Amaldiçoado",
      teste: "Acerto garantido dentro",
      descricao: "Manifesta o domínio inato do usuário. Cria uma cúpula amaldiçoada com acerto garantido do efeito assinatura. Após o uso: 1 nível de exaustão e -3 PE máximos pelo dia. Uso restrito: 1x por descanso longo."
    }
  }, {
    label: "Cortina Simples",
    data: {
      nome: "Cortina Simples (Barreira)",
      nivel: "1",
      conjuracao: "1 Minuto",
      alcance: "20m de raio",
      alvo: "Área",
      duracao: "1 hora",
      custoEnergia: "2",
      dano: "",
      tipoDano: "",
      teste: "",
      descricao: "Cúpula invisível que esconde atividade amaldiçoada de olhos comuns. Não impede passagem física. Útil para conter combates em áreas urbanas."
    }
  }, {
    label: "Barreira de Contenção",
    data: {
      nome: "Barreira de Contenção",
      nivel: "2",
      conjuracao: "Ação Comum",
      alcance: "12m de raio",
      alvo: "Área",
      duracao: "Concentração até 5 turnos",
      custoEnergia: "4",
      dano: "2d8",
      tipoDano: "Amaldiçoado",
      teste: "",
      descricao: "Cúpula sólida (CA 18, 80 PV). Bloqueia entrada e saída; quem tenta atravessar leva 2d8 de dano amaldiçoado."
    }
  }];
  const updateAbility = (i, partial) => {
    setForm(prev => {
      const newAbs = [...prev.abilities];
      newAbs[i] = {
        ...newAbs[i],
        ...partial
      };
      return {
        ...prev,
        abilities: newAbs
      };
    });
  };
  const removeAbility = i => {
    setForm(prev => ({
      ...prev,
      abilities: prev.abilities.filter((_, idx) => idx !== i)
    }));
  };
  const toggleEquipment = item => {
    setForm(prev => {
      const exists = prev.equipmentItems.find(e => e.nome === item.nome);
      return {
        ...prev,
        equipmentItems: exists ? prev.equipmentItems.filter(e => e.nome !== item.nome) : [...prev.equipmentItems, item]
      };
    });
  };
  const addCustomEquipment = () => {
    if (!form.customEquipment.nome.trim()) {
      toast({
        title: "Informe o nome do item.",
        variant: "destructive"
      });
      return;
    }
    if (!form.customEquipment.buff.trim()) {
      toast({
        title: "Todo item precisa de um buff/efeito.",
        variant: "destructive"
      });
      return;
    }
    setForm(prev => ({
      ...prev,
      equipmentItems: [...prev.equipmentItems, {
        ...prev.customEquipment
      }],
      customEquipment: {
        nome: "",
        buff: ""
      }
    }));
  };
  const removeEquipment = nome => {
    setForm(prev => ({
      ...prev,
      equipmentItems: prev.equipmentItems.filter(e => e.nome !== nome)
    }));
  };
  const tabs = [{
    id: "identidade",
    label: "Identidade",
    icon: User
  }, {
    id: "atributos",
    label: "Atributos",
    icon: Swords
  }, {
    id: "pericias",
    label: "Perícias",
    icon: Scroll
  }, {
    id: "tecnica",
    label: "Técnica",
    icon: Zap
  }, {
    id: "aptidoes",
    label: "Aptidões",
    icon: Scroll
  }, {
    id: "equipamentos",
    label: "Equipamentos",
    icon: Package
  }];
  const currentIndex = tabs.findIndex(t => t.id === activeTab);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === tabs.length - 1;
  const maxHp = 10 + form.constitution + (form.level - 1) * 5;
  const maxEnergy = 10 + form.wisdom + (form.level - 1) * 5;
  const updateCustomStat = (idx, value) => {
    setForm(p => ({
      ...p,
      customStats: p.customStats.map((s, i) => i === idx ? {
        ...s,
        value
      } : s)
    }));
  };
  const removeCustomStat = idx => {
    setForm(p => ({
      ...p,
      customStats: p.customStats.filter((_, i) => i !== idx)
    }));
  };
  function handleSubmit() {
    if (!form.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Dê um nome ao seu personagem.",
        variant: "destructive"
      });
      setActiveTab("identidade");
      return;
    }
    if (!form.origin) {
      toast({
        title: "Origem obrigatória",
        description: "Escolha a origem do personagem.",
        variant: "destructive"
      });
      setActiveTab("identidade");
      return;
    }
    if (form.specializations.length === 0) {
      toast({
        title: "Especialização obrigatória",
        description: "Selecione ao menos uma especialização.",
        variant: "destructive"
      });
      setActiveTab("identidade");
      return;
    }
    if (form.clanHeritage === "Outro" && !form.clanCustom.trim()) {
      toast({
        title: "Informe o nome do clã",
        description: "Você escolheu 'Outro' — escreva o nome do clã.",
        variant: "destructive"
      });
      setActiveTab("identidade");
      return;
    }
    const finalClan = form.clanHeritage === "Outro" ? form.clanCustom : form.clanHeritage !== "Nenhuma" ? form.clanHeritage : undefined;
    const trainedSkills = Object.entries(form.skillsMap).filter(([, v]) => v.treinada).map(([k]) => k);
    createCharacter({
      data: {
        name: form.name,
        level: form.level,
        origin: form.origin,
        clanHeritage: finalClan,
        specialization: form.specializations.join(", "),
        grade: form.grade,
        backstory: form.backstory || undefined,
        personality: form.personality || undefined,
        technique: form.technique || undefined,
        technique_description: form.technique_description || undefined,
        strength: form.strength,
        dexterity: form.dexterity,
        constitution: form.constitution,
        intelligence: form.intelligence,
        wisdom: form.wisdom,
        charisma: form.charisma,
        armorClass: form.armorClass,
        aptitudes: form.selectedAptitudes.length > 0 ? JSON.stringify(form.selectedAptitudes) : undefined,
        customStats: form.customStats.length > 0 ? JSON.stringify(form.customStats) : undefined,
        skills: trainedSkills.length > 0 ? JSON.stringify(trainedSkills) : undefined,
        equipment: form.equipmentItems.length > 0 ? JSON.stringify(form.equipmentItems.map(e => `${e.nome} — ${e.buff}`)) : undefined,
        abilities: form.abilities.length > 0 ? JSON.stringify(form.abilities.filter(a => a.nome).map(a => {
          const parts = [a.nome];
          if (a.nivel) parts.push(`Nível ${a.nivel}`);
          if (a.custoEnergia && a.custoEnergia !== "0") parts.push(`Custo: ${a.custoEnergia} PE`);
          if (a.dano) parts.push(`Dano: ${a.dano}${a.tipoDano ? " " + a.tipoDano : ""}`);
          if (a.teste) parts.push(`Teste: ${a.teste}`);
          if (a.alcance) parts.push(`Alcance: ${a.alcance}`);
          if (a.descricao) parts.push(a.descricao);
          return parts.join(" | ");
        })) : undefined,
        notes: form.notes || undefined
      }
    }, {
      onSuccess: data => {
        toast({
          title: "Ficha criada!",
          description: `${form.name} foi registrado com sucesso.`
        });
        navigate(`/fichas/${data.id}`);
      },
      onError: () => {
        toast({
          title: "Erro ao criar ficha",
          description: "Tente novamente.",
          variant: "destructive"
        });
      }
    });
  }
  const aptidoesPorCategoria = APTIDOES_DISPONIVEIS.reduce((acc, apt) => {
    if (!acc[apt.categoria]) acc[apt.categoria] = [];
    acc[apt.categoria].push(apt);
    return acc;
  }, {});
  return /*#__PURE__*/_jsxs("div", {
    className: "max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500",
    children: [/*#__PURE__*/_jsxs("section", {
      className: "relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-background via-primary/[0.05] to-background p-6 md:p-8",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "absolute inset-0 pointer-events-none",
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-45",
          style: {
            background: "radial-gradient(circle, hsl(265 85% 50% / 0.4), transparent 70%)"
          }
        }), /*#__PURE__*/_jsx("div", {
          className: "absolute -bottom-24 -right-20 w-80 h-80 rounded-full blur-3xl opacity-35",
          style: {
            background: "radial-gradient(circle, hsl(355 80% 45% / 0.3), transparent 70%)"
          }
        }), /*#__PURE__*/_jsx("div", {
          "aria-hidden": true,
          className: "absolute inset-y-0 right-2 md:right-8 flex items-center select-none font-jp font-black leading-none text-[18vw] md:text-[12vw] opacity-[0.05]",
          style: {
            color: "hsl(265 85% 70%)"
          },
          children: "\u5951"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative space-y-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [/*#__PURE__*/_jsx("span", {
            className: "font-jp text-xs tracking-[0.5em] text-primary/80",
            children: "\u65B0\u8853\u5E2B"
          }), /*#__PURE__*/_jsx("span", {
            className: "h-px w-12 bg-gradient-to-r from-primary/60 to-transparent"
          })]
        }), /*#__PURE__*/_jsx("h1", {
          className: "font-display text-3xl md:text-4xl font-bold tracking-wider text-cursed",
          children: "FORJAR NOVO FEITICEIRO"
        }), /*#__PURE__*/_jsxs("p", {
          className: "text-muted-foreground text-sm md:text-base max-w-2xl",
          children: ["Preencha as informa\xE7\xF5es do seu feiticeiro. Os campos marcados com ", /*#__PURE__*/_jsx("span", {
            className: "text-destructive",
            children: "*"
          }), " s\xE3o obrigat\xF3rios. A energia responde \xE0 inten\xE7\xE3o."]
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "relative",
      children: /*#__PURE__*/_jsx("div", {
        className: "flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin",
        children: tabs.map((tab, i) => {
          const isActive = activeTab === tab.id;
          const isDone = i < currentIndex;
          return /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1 flex-1 min-w-fit",
            children: [/*#__PURE__*/_jsxs("button", {
              onClick: () => setActiveTab(tab.id),
              className: `group relative flex items-center gap-2 px-3 py-2 rounded-md text-xs font-display tracking-wider uppercase transition-all whitespace-nowrap border ${isActive ? "text-white border-primary/70 bg-gradient-to-br from-primary/30 to-primary/10 shadow-[0_0_18px_hsl(265_85%_62%_/_0.4)]" : isDone ? "text-primary/80 border-primary/30 bg-primary/[0.04] hover:border-primary/50" : "text-muted-foreground border-border/40 hover:text-foreground hover:border-border"}`,
              children: [/*#__PURE__*/_jsx("span", {
                className: `flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold tabular-nums ${isActive ? "bg-primary text-white shadow-[0_0_10px_hsl(265_85%_62%)]" : isDone ? "bg-primary/30 text-primary" : "bg-muted/40 text-muted-foreground"}`,
                children: i + 1
              }), /*#__PURE__*/_jsx(tab.icon, {
                className: "h-3.5 w-3.5"
              }), /*#__PURE__*/_jsx("span", {
                className: "hidden sm:inline",
                children: tab.label
              })]
            }), i < tabs.length - 1 && /*#__PURE__*/_jsx("div", {
              className: `h-px flex-1 min-w-[12px] transition-colors ${isDone ? "bg-gradient-to-r from-primary/60 to-primary/20" : "bg-border/40"}`
            })]
          }, tab.id);
        })
      })
    }), /*#__PURE__*/_jsxs(Tabs, {
      value: activeTab,
      onValueChange: setActiveTab,
      children: [/*#__PURE__*/_jsx(TabsList, {
        className: "hidden",
        children: tabs.map(t => /*#__PURE__*/_jsx(TabsTrigger, {
          value: t.id,
          children: t.label
        }, t.id))
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "identidade",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/50",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "border-b border-border/40",
            children: [/*#__PURE__*/_jsxs(CardTitle, {
              className: "flex items-center gap-2 text-lg",
              children: [/*#__PURE__*/_jsx(User, {
                className: "h-5 w-5 text-primary"
              }), "Identidade do Personagem"]
            }), /*#__PURE__*/_jsx(CardDescription, {
              children: "Informa\xE7\xF5es b\xE1sicas de quem \xE9 este feiticeiro."
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "pt-6 space-y-6",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "grid grid-cols-1 md:grid-cols-2 gap-4",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "md:col-span-2 space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  htmlFor: "name",
                  children: "Nome *"
                }), /*#__PURE__*/_jsx(Input, {
                  id: "name",
                  placeholder: "Nome do personagem",
                  value: form.name,
                  onChange: e => set("name", e.target.value),
                  className: "bg-background/60"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  children: "N\xEDvel"
                }), /*#__PURE__*/_jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [/*#__PURE__*/_jsx(Input, {
                    type: "number",
                    min: 1,
                    max: 20,
                    value: form.level,
                    onChange: e => set("level", Number(e.target.value)),
                    className: "bg-background/60 w-24"
                  }), /*#__PURE__*/_jsxs("span", {
                    className: "text-sm text-muted-foreground",
                    children: ["Maestria: ", /*#__PURE__*/_jsxs("strong", {
                      className: "text-foreground",
                      children: ["+", masteryBonus]
                    })]
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  children: "Grau"
                }), /*#__PURE__*/_jsxs(Select, {
                  value: form.grade,
                  onValueChange: v => set("grade", v),
                  children: [/*#__PURE__*/_jsx(SelectTrigger, {
                    className: "bg-background/60",
                    children: /*#__PURE__*/_jsx(SelectValue, {})
                  }), /*#__PURE__*/_jsx(SelectContent, {
                    children: GRAUS.map(g => /*#__PURE__*/_jsx(SelectItem, {
                      value: g,
                      children: g
                    }, g))
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  children: "Origem *"
                }), /*#__PURE__*/_jsxs(Select, {
                  value: form.origin,
                  onValueChange: v => set("origin", v),
                  children: [/*#__PURE__*/_jsx(SelectTrigger, {
                    className: "bg-background/60",
                    children: /*#__PURE__*/_jsx(SelectValue, {
                      placeholder: "Selecione a origem..."
                    })
                  }), /*#__PURE__*/_jsx(SelectContent, {
                    children: ORIGENS.map(o => /*#__PURE__*/_jsx(SelectItem, {
                      value: o,
                      children: o
                    }, o))
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  children: "Heran\xE7a de Cl\xE3"
                }), /*#__PURE__*/_jsxs(Select, {
                  value: form.clanHeritage,
                  onValueChange: v => set("clanHeritage", v),
                  children: [/*#__PURE__*/_jsx(SelectTrigger, {
                    className: "bg-background/60",
                    children: /*#__PURE__*/_jsx(SelectValue, {})
                  }), /*#__PURE__*/_jsx(SelectContent, {
                    children: CLANS.map(c => /*#__PURE__*/_jsx(SelectItem, {
                      value: c,
                      children: c
                    }, c))
                  })]
                }), form.clanHeritage === "Outro" && /*#__PURE__*/_jsx(Input, {
                  placeholder: "Digite o nome do cl\xE3...",
                  value: form.clanCustom,
                  onChange: e => set("clanCustom", e.target.value),
                  className: "bg-background/60 mt-2"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "md:col-span-2 space-y-1.5",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-baseline justify-between",
                  children: [/*#__PURE__*/_jsxs(Label, {
                    children: ["Especializa\xE7\xF5es * ", /*#__PURE__*/_jsx("span", {
                      className: "text-xs text-muted-foreground font-normal",
                      children: "(selecione uma ou mais)"
                    })]
                  }), form.specializations.length > 0 && /*#__PURE__*/_jsxs("span", {
                    className: "text-xs text-primary",
                    children: [form.specializations.length, " selecionada(s)"]
                  })]
                }), /*#__PURE__*/_jsx("div", {
                  className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
                  children: ESPECIALIZACOES.map(esp => {
                    const selected = form.specializations.includes(esp);
                    return /*#__PURE__*/_jsxs("button", {
                      type: "button",
                      onClick: () => toggleSpecialization(esp),
                      className: `px-3 py-2 rounded-md text-sm font-medium border transition-all text-left flex items-center gap-2 ${selected ? "border-primary bg-primary/15 text-primary" : "border-border/50 bg-card/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
                      children: [/*#__PURE__*/_jsx("div", {
                        className: `w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${selected ? "border-primary bg-primary" : "border-border/60"}`,
                        children: selected && /*#__PURE__*/_jsx("span", {
                          className: "text-[10px] text-white font-bold leading-none",
                          children: "\u2713"
                        })
                      }), esp]
                    }, esp);
                  })
                })]
              })]
            }), /*#__PURE__*/_jsx(Separator, {
              className: "border-border/40"
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-4",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Hist\xF3rico e Personalidade"
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  htmlFor: "personality",
                  children: "Tra\xE7os de Personalidade"
                }), /*#__PURE__*/_jsx(Textarea, {
                  id: "personality",
                  placeholder: "Como o personagem age, fala, pensa?",
                  value: form.personality,
                  onChange: e => set("personality", e.target.value),
                  className: "bg-background/60 resize-none h-20"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  htmlFor: "backstory",
                  children: "Hist\xF3ria"
                }), /*#__PURE__*/_jsx(Textarea, {
                  id: "backstory",
                  placeholder: "De onde veio este feiticeiro? O que o moldou?",
                  value: form.backstory,
                  onChange: e => set("backstory", e.target.value),
                  className: "bg-background/60 resize-none h-28"
                })]
              })]
            })]
          })]
        })
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "atributos",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/50",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "border-b border-border/40",
            children: [/*#__PURE__*/_jsxs(CardTitle, {
              className: "flex items-center gap-2 text-lg",
              children: [/*#__PURE__*/_jsx(Swords, {
                className: "h-5 w-5 text-primary"
              }), "Atributos e Combate"]
            }), /*#__PURE__*/_jsx(CardDescription, {
              children: "Cada atributo come\xE7a em 1 e funciona como modificador direto (estilo C.R.I.S). Use os bot\xF5es + / \u2212 ou digite o valor."
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "pt-6 space-y-8",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 text-center",
                children: "Atributos Base \u2014 clique no n\xFAmero para editar"
              }), /*#__PURE__*/_jsx(AtributosHexagon, {
                baseStats: [{
                  abbr: "FOR",
                  label: "Força",
                  value: form.strength,
                  onChange: v => set("strength", v)
                }, {
                  abbr: "DEX",
                  label: "Destreza",
                  value: form.dexterity,
                  onChange: v => set("dexterity", v)
                }, {
                  abbr: "CON",
                  label: "Constituição",
                  value: form.constitution,
                  onChange: v => set("constitution", v)
                }, {
                  abbr: "INT",
                  label: "Inteligência",
                  value: form.intelligence,
                  onChange: v => set("intelligence", v)
                }, {
                  abbr: "SAB",
                  label: "Sabedoria",
                  value: form.wisdom,
                  onChange: v => set("wisdom", v)
                }, {
                  abbr: "CAR",
                  label: "Carisma",
                  value: form.charisma,
                  onChange: v => set("charisma", v)
                }],
                customStats: form.customStats,
                onCustomStatChange: updateCustomStat,
                onCustomStatRemove: removeCustomStat,
                onAddCustomStat: name => {
                  if (form.customStats.some(s => s.name.toLowerCase() === name.toLowerCase())) {
                    toast({
                      title: "Atributo já existe",
                      variant: "destructive"
                    });
                    return;
                  }
                  setForm(p => ({
                    ...p,
                    customStats: [...p.customStats, {
                      name,
                      value: 1
                    }]
                  }));
                }
              })]
            }), /*#__PURE__*/_jsx(Separator, {
              className: "border-border/40"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4",
                children: "Estat\xEDsticas de Combate"
              }), /*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "p-4 border border-red-500/30 rounded-lg bg-red-500/5 text-center",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "text-xs font-bold uppercase tracking-wider text-red-400 mb-1",
                    children: "PV M\xE1ximo"
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-3xl font-bold text-red-400",
                    children: maxHp
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-xs text-muted-foreground mt-1",
                    children: "10 + CON + (n\xEDvel-1)\xD75"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "p-4 border border-primary/30 rounded-lg bg-primary/5 text-center",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "text-xs font-bold uppercase tracking-wider text-primary mb-1",
                    children: "PE M\xE1ximo"
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-3xl font-bold text-primary",
                    children: maxEnergy
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-xs text-muted-foreground mt-1",
                    children: "10 + SAB + (n\xEDvel-1)\xD75"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "p-4 border border-border/50 rounded-lg bg-card/30 space-y-1.5",
                  children: [/*#__PURE__*/_jsx(Label, {
                    className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                    children: "Classe de Armadura"
                  }), /*#__PURE__*/_jsx(Input, {
                    type: "number",
                    min: 1,
                    value: form.armorClass,
                    onChange: e => set("armorClass", Number(e.target.value)),
                    className: "bg-background/60 text-center text-xl font-bold h-10"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "p-4 border border-border/50 rounded-lg bg-card/30 text-center",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1",
                    children: "B\xF4nus Maestria"
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "text-3xl font-bold",
                    children: ["+", masteryBonus]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "text-xs text-muted-foreground mt-1",
                    children: ["N\xEDvel ", form.level]
                  })]
                })]
              })]
            })]
          })]
        })
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "pericias",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/50",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "border-b border-border/40",
            children: [/*#__PURE__*/_jsxs(CardTitle, {
              className: "flex items-center gap-2 text-lg",
              children: [/*#__PURE__*/_jsx(Scroll, {
                className: "h-5 w-5 text-primary"
              }), "Per\xEDcias"]
            }), /*#__PURE__*/_jsx(CardDescription, {
              children: "Marque as per\xEDcias treinadas (somam o b\xF4nus de maestria). Adicione b\xF4nus extras em \"Outros\" se necess\xE1rio."
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "pt-6",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "border border-border/40 rounded-lg overflow-hidden",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-[1fr_60px_70px_50px_60px] sm:grid-cols-[1fr_70px_70px_80px_80px] text-xs font-bold uppercase tracking-wider text-muted-foreground bg-card/60 border-b border-border/40",
                children: [/*#__PURE__*/_jsx("div", {
                  className: "px-3 py-2",
                  children: "Per\xEDcia"
                }), /*#__PURE__*/_jsx("div", {
                  className: "px-2 py-2 text-center",
                  children: "Atrib."
                }), /*#__PURE__*/_jsx("div", {
                  className: "px-2 py-2 text-center",
                  children: "B\xF4nus"
                }), /*#__PURE__*/_jsx("div", {
                  className: "px-2 py-2 text-center",
                  children: "Treino"
                }), /*#__PURE__*/_jsx("div", {
                  className: "px-2 py-2 text-center",
                  children: "Outros"
                })]
              }), PERICIAS.map(p => {
                const state = form.skillsMap[p.nome] ?? {
                  treinada: false,
                  outros: 0
                };
                const bonus = calcBonusPericia(p);
                const colorClass = trainingColor(state.outros);
                return /*#__PURE__*/_jsxs("div", {
                  className: "grid grid-cols-[1fr_60px_70px_50px_60px] sm:grid-cols-[1fr_70px_70px_80px_80px] items-center border-b border-border/20 last:border-b-0 hover:bg-card/40 transition-colors",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: `px-3 py-2 text-sm font-medium flex items-center gap-1 ${colorClass}`,
                    children: [p.nome, p.carga && /*#__PURE__*/_jsx("span", {
                      className: "text-red-400 text-xs",
                      title: "Penalidade de carga",
                      children: "+"
                    }), p.somenteTreinada && /*#__PURE__*/_jsx("span", {
                      className: "text-muted-foreground text-xs",
                      title: "Somente treinada",
                      children: "*"
                    })]
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "px-2 py-2 text-center text-xs font-mono text-muted-foreground",
                    children: ["(", p.atributo, ")"]
                  }), /*#__PURE__*/_jsx("div", {
                    className: "px-2 py-2 text-center",
                    children: /*#__PURE__*/_jsx("span", {
                      className: `text-sm font-bold font-mono ${bonus > 0 ? "text-primary" : bonus < 0 ? "text-red-400" : "text-muted-foreground"}`,
                      children: fmtMod(bonus)
                    })
                  }), /*#__PURE__*/_jsx("div", {
                    className: "px-2 py-2 flex justify-center",
                    children: /*#__PURE__*/_jsx(Checkbox, {
                      checked: state.treinada,
                      onCheckedChange: v => setSkill(p.nome, {
                        treinada: !!v
                      })
                    })
                  }), /*#__PURE__*/_jsx("div", {
                    className: "px-2 py-2",
                    children: /*#__PURE__*/_jsx(Input, {
                      type: "number",
                      value: state.outros || 0,
                      onChange: e => setSkill(p.nome, {
                        outros: Number(e.target.value) || 0
                      }),
                      className: `h-7 text-center text-xs font-mono font-bold bg-background/60 px-1 ${colorClass}`
                    })
                  })]
                }, p.nome);
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground",
              children: [/*#__PURE__*/_jsxs("span", {
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-red-400 font-bold",
                  children: "+"
                }), " Penalidade de carga"]
              }), /*#__PURE__*/_jsxs("span", {
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-muted-foreground font-bold",
                  children: "*"
                }), " Somente treinada"]
              }), /*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-2",
                children: ["Treino:", /*#__PURE__*/_jsx("span", {
                  className: "text-muted-foreground/60 font-bold",
                  children: "0"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-green-400 font-bold",
                  children: "5"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-blue-400 font-bold",
                  children: "10"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-red-400 font-bold",
                  children: "15"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-purple-400 font-bold",
                  children: "20"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-white font-bold",
                  children: "25"
                })]
              })]
            })]
          })]
        })
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "tecnica",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/50",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "border-b border-border/40",
            children: [/*#__PURE__*/_jsxs(CardTitle, {
              className: "flex items-center gap-2 text-lg",
              children: [/*#__PURE__*/_jsx(Zap, {
                className: "h-5 w-5 text-primary"
              }), "T\xE9cnica Amaldi\xE7oada"]
            }), /*#__PURE__*/_jsx(CardDescription, {
              children: "A t\xE9cnica inata define o arsenal do feiticeiro. Escolha uma existente ou crie a sua."
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "pt-6 space-y-6",
            children: [/*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx(Label, {
                className: "mb-3 block",
                children: "T\xE9cnicas da Enciclop\xE9dia Amaldi\xE7oada"
              }), /*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                children: [techniques?.filter(t => !t.isCustom).map(t => /*#__PURE__*/_jsxs("button", {
                  type: "button",
                  onClick: () => {
                    set("technique", t.name);
                    set("technique_description", t.description);
                  },
                  className: `p-3 rounded-lg border text-left transition-all ${form.technique === t.name ? "border-primary bg-primary/10" : "border-border/40 bg-card/30 hover:border-primary/30"}`,
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex items-center justify-between mb-1",
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "font-semibold text-sm",
                      children: t.name
                    }), /*#__PURE__*/_jsx(Badge, {
                      variant: "outline",
                      className: "text-xs",
                      children: t.category
                    })]
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-xs text-muted-foreground line-clamp-2",
                    children: t.description
                  })]
                }, t.id)), /*#__PURE__*/_jsxs("button", {
                  type: "button",
                  onClick: () => {
                    set("technique", "Técnica Original");
                    set("technique_description", "");
                  },
                  className: `p-3 rounded-lg border text-left transition-all border-dashed ${form.technique === "Técnica Original" ? "border-primary bg-primary/10" : "border-border/40 bg-card/30 hover:border-primary/30"}`,
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "flex items-center gap-2 mb-1",
                    children: /*#__PURE__*/_jsx("span", {
                      className: "font-semibold text-sm",
                      children: "+ T\xE9cnica Original"
                    })
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-xs text-muted-foreground",
                    children: "Criar uma t\xE9cnica inata \xFAnica para o personagem."
                  })]
                })]
              })]
            }), form.technique && /*#__PURE__*/_jsxs("div", {
              className: "space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  children: "Nome da T\xE9cnica"
                }), /*#__PURE__*/_jsx(Input, {
                  value: form.technique,
                  onChange: e => set("technique", e.target.value),
                  className: "bg-background/60",
                  placeholder: "Nome da t\xE9cnica inata..."
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-1.5",
                children: [/*#__PURE__*/_jsx(Label, {
                  children: "Descri\xE7\xE3o e Funcionamento B\xE1sico"
                }), /*#__PURE__*/_jsx(Textarea, {
                  value: form.technique_description,
                  onChange: e => set("technique_description", e.target.value),
                  className: "bg-background/60 resize-none h-28",
                  placeholder: "Como a t\xE9cnica funciona? Quais s\xE3o seus fundamentos?"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "space-y-3",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "flex items-center justify-between",
                  children: [/*#__PURE__*/_jsx(Label, {
                    children: "Habilidades, Movimentos e Universais"
                  }), /*#__PURE__*/_jsxs(Button, {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => addAbility(),
                    className: "gap-1 text-xs",
                    children: [/*#__PURE__*/_jsx(Plus, {
                      className: "h-3 w-3"
                    }), " Adicionar Habilidade"]
                  })]
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: "Inclua aqui as habilidades da t\xE9cnica inata + movimentos universais (Refor\xE7o, Lampejo Negro, T\xE9cnica Reversa, Expans\xE3o de Dom\xEDnio, Barreiras). Todo personagem come\xE7a com 2 habilidades de n\xEDvel 0 ou 1."
                }), /*#__PURE__*/_jsxs("div", {
                  className: "space-y-2 p-3 rounded-lg border border-primary/20 bg-primary/[0.04]",
                  children: [/*#__PURE__*/_jsx("p", {
                    className: "text-xs font-bold uppercase tracking-wider text-primary/80",
                    children: "Adicionar Habilidade Universal"
                  }), /*#__PURE__*/_jsx("div", {
                    className: "flex flex-wrap gap-1.5",
                    children: UNIVERSAL_PRESETS.map(preset => /*#__PURE__*/_jsxs(Button, {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => addAbility(preset.data),
                      className: "h-7 text-xs gap-1 border-primary/30 hover:bg-primary/10 hover:border-primary/50",
                      children: [/*#__PURE__*/_jsx(Plus, {
                        className: "h-3 w-3"
                      }), " ", preset.label]
                    }, preset.label))
                  })]
                }), form.abilities.length === 0 && /*#__PURE__*/_jsx("div", {
                  className: "text-center py-6 border border-dashed border-border/40 rounded-lg text-sm text-muted-foreground",
                  children: "Clique em \"Adicionar Habilidade\" para come\xE7ar."
                }), form.abilities.map((ab, i) => /*#__PURE__*/_jsxs(Card, {
                  className: "bg-card/40 border-border/40",
                  children: [/*#__PURE__*/_jsxs(CardHeader, {
                    className: "py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b border-border/30",
                    children: [/*#__PURE__*/_jsx("div", {
                      className: "flex items-center gap-2",
                      children: /*#__PURE__*/_jsxs("span", {
                        className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
                        children: ["Habilidade ", i + 1]
                      })
                    }), /*#__PURE__*/_jsx(Button, {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: () => removeAbility(i),
                      className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive",
                      children: /*#__PURE__*/_jsx(X, {
                        className: "h-4 w-4"
                      })
                    })]
                  }), /*#__PURE__*/_jsxs(CardContent, {
                    className: "p-4 space-y-3",
                    children: [/*#__PURE__*/_jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-3",
                      children: [/*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsx(Label, {
                          className: "text-xs",
                          children: "Nome"
                        }), /*#__PURE__*/_jsx(Input, {
                          value: ab.nome,
                          onChange: e => updateAbility(i, {
                            nome: e.target.value
                          }),
                          className: "bg-background/60 h-8",
                          placeholder: "Ex: Disparo de Pregos"
                        })]
                      }), /*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsx(Label, {
                          className: "text-xs",
                          children: "N\xEDvel"
                        }), /*#__PURE__*/_jsxs(Select, {
                          value: ab.nivel,
                          onValueChange: v => updateAbility(i, {
                            nivel: v
                          }),
                          children: [/*#__PURE__*/_jsx(SelectTrigger, {
                            className: "bg-background/60 h-8",
                            children: /*#__PURE__*/_jsx(SelectValue, {})
                          }), /*#__PURE__*/_jsx(SelectContent, {
                            children: ["0", "1", "2", "3", "4", "5"].map(n => /*#__PURE__*/_jsxs(SelectItem, {
                              value: n,
                              children: ["N\xEDvel ", n]
                            }, n))
                          })]
                        })]
                      })]
                    }), /*#__PURE__*/_jsxs("div", {
                      className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
                      children: [/*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsx(Label, {
                          className: "text-xs",
                          children: "Conjura\xE7\xE3o"
                        }), /*#__PURE__*/_jsxs(Select, {
                          value: ab.conjuracao,
                          onValueChange: v => updateAbility(i, {
                            conjuracao: v
                          }),
                          children: [/*#__PURE__*/_jsx(SelectTrigger, {
                            className: "bg-background/60 h-8",
                            children: /*#__PURE__*/_jsx(SelectValue, {})
                          }), /*#__PURE__*/_jsx(SelectContent, {
                            children: ["Ação Comum", "Ação Bônus", "Reação", "Ação Livre", "1 Minuto", "10 Minutos"].map(n => /*#__PURE__*/_jsx(SelectItem, {
                              value: n,
                              children: n
                            }, n))
                          })]
                        })]
                      }), /*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsx(Label, {
                          className: "text-xs",
                          children: "Alcance"
                        }), /*#__PURE__*/_jsx(Input, {
                          value: ab.alcance,
                          onChange: e => updateAbility(i, {
                            alcance: e.target.value
                          }),
                          className: "bg-background/60 h-8",
                          placeholder: "9 m"
                        })]
                      }), /*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsx(Label, {
                          className: "text-xs",
                          children: "Alvo"
                        }), /*#__PURE__*/_jsx(Input, {
                          value: ab.alvo,
                          onChange: e => updateAbility(i, {
                            alvo: e.target.value
                          }),
                          className: "bg-background/60 h-8",
                          placeholder: "Uma criatura"
                        })]
                      }), /*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsx(Label, {
                          className: "text-xs",
                          children: "Dura\xE7\xE3o"
                        }), /*#__PURE__*/_jsx(Input, {
                          value: ab.duracao,
                          onChange: e => updateAbility(i, {
                            duracao: e.target.value
                          }),
                          className: "bg-background/60 h-8",
                          placeholder: "Imediata"
                        })]
                      })]
                    }), /*#__PURE__*/_jsxs("div", {
                      className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
                      children: [/*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsxs(Label, {
                          className: "text-xs flex items-center gap-1",
                          children: [/*#__PURE__*/_jsx("span", {
                            className: "text-primary",
                            children: "PE"
                          }), " Custo de Energia"]
                        }), /*#__PURE__*/_jsx(Input, {
                          type: "number",
                          min: 0,
                          value: ab.custoEnergia,
                          onChange: e => updateAbility(i, {
                            custoEnergia: e.target.value
                          }),
                          className: "bg-background/60 h-8 font-mono",
                          placeholder: "0"
                        })]
                      }), /*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsx(Label, {
                          className: "text-xs flex items-center gap-1",
                          children: /*#__PURE__*/_jsx("span", {
                            className: "text-red-400",
                            children: "Dados de Dano"
                          })
                        }), /*#__PURE__*/_jsx(Input, {
                          value: ab.dano,
                          onChange: e => updateAbility(i, {
                            dano: e.target.value
                          }),
                          className: "bg-background/60 h-8 font-mono",
                          placeholder: "2d8, 1d10..."
                        })]
                      }), /*#__PURE__*/_jsxs("div", {
                        className: "space-y-1",
                        children: [/*#__PURE__*/_jsx(Label, {
                          className: "text-xs",
                          children: "Tipo de Dano"
                        }), /*#__PURE__*/_jsxs(Select, {
                          value: ab.tipoDano || "nenhum",
                          onValueChange: v => updateAbility(i, {
                            tipoDano: v === "nenhum" ? "" : v
                          }),
                          children: [/*#__PURE__*/_jsx(SelectTrigger, {
                            className: "bg-background/60 h-8",
                            children: /*#__PURE__*/_jsx(SelectValue, {
                              placeholder: "Tipo..."
                            })
                          }), /*#__PURE__*/_jsxs(SelectContent, {
                            children: [/*#__PURE__*/_jsx(SelectItem, {
                              value: "nenhum",
                              children: "Nenhum"
                            }), ["Cortante", "Perfurante", "Contundente", "Força", "Fogo", "Frio", "Elétrico", "Ácido", "Veneno", "Psíquico", "Necrótico", "Radiante", "Trovão"].map(n => /*#__PURE__*/_jsx(SelectItem, {
                              value: n,
                              children: n
                            }, n))]
                          })]
                        })]
                      })]
                    }), /*#__PURE__*/_jsxs("div", {
                      className: "space-y-1",
                      children: [/*#__PURE__*/_jsx(Label, {
                        className: "text-xs",
                        children: "Teste de Ataque ou Resist\xEAncia"
                      }), /*#__PURE__*/_jsx(Input, {
                        value: ab.teste,
                        onChange: e => updateAbility(i, {
                          teste: e.target.value
                        }),
                        className: "bg-background/60 h-8",
                        placeholder: "Ex: Teste de Pontaria | Resist\xEAncia de Reflexos"
                      })]
                    }), /*#__PURE__*/_jsxs("div", {
                      className: "space-y-1",
                      children: [/*#__PURE__*/_jsx(Label, {
                        className: "text-xs",
                        children: "Descri\xE7\xE3o / Efeito"
                      }), /*#__PURE__*/_jsx(Textarea, {
                        value: ab.descricao,
                        onChange: e => updateAbility(i, {
                          descricao: e.target.value
                        }),
                        className: "bg-background/60 resize-none h-20 text-sm",
                        placeholder: "Descreva o efeito da habilidade em detalhes, incluindo condi\xE7\xF5es, \xE1reas de efeito, etc."
                      })]
                    })]
                  })]
                }, i))]
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-1.5",
              children: [/*#__PURE__*/_jsx(Label, {
                htmlFor: "notes",
                children: "Notas Adicionais / Votos de Restri\xE7\xE3o"
              }), /*#__PURE__*/_jsx(Textarea, {
                id: "notes",
                value: form.notes,
                onChange: e => set("notes", e.target.value),
                className: "bg-background/60 resize-none h-20",
                placeholder: "Votos de restri\xE7\xE3o, peculiaridades da t\xE9cnica, notas do narrador..."
              })]
            })]
          })]
        })
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "aptidoes",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/50",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "border-b border-border/40",
            children: [/*#__PURE__*/_jsxs(CardTitle, {
              className: "flex items-center gap-2 text-lg",
              children: [/*#__PURE__*/_jsx(Scroll, {
                className: "h-5 w-5 text-primary"
              }), "Aptid\xF5es Amaldi\xE7oadas"]
            }), /*#__PURE__*/_jsx(CardDescription, {
              children: "Selecione as aptid\xF5es do personagem. Elas definem o dom\xEDnio da energia amaldi\xE7oada."
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "pt-6 space-y-6",
            children: [form.selectedAptitudes.length > 0 && /*#__PURE__*/_jsxs("div", {
              className: "flex flex-wrap gap-2 p-3 border border-primary/20 rounded-lg bg-primary/5",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-xs text-muted-foreground self-center mr-1",
                children: "Selecionadas:"
              }), form.selectedAptitudes.map(a => /*#__PURE__*/_jsxs(Badge, {
                variant: "secondary",
                className: "cursor-pointer",
                onClick: () => toggleAptitude(a),
                children: [a, " \xD7"]
              }, a))]
            }), Object.entries(aptidoesPorCategoria).map(([categoria, apts]) => /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsxs("h3", {
                className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "h-px flex-1 bg-border/40"
                }), categoria, /*#__PURE__*/_jsx("span", {
                  className: "h-px flex-1 bg-border/40"
                })]
              }), /*#__PURE__*/_jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2",
                children: apts.map(apt => /*#__PURE__*/_jsx("button", {
                  type: "button",
                  onClick: () => toggleAptitude(apt.nome),
                  className: `p-3 rounded-lg border text-left transition-all text-sm ${form.selectedAptitudes.includes(apt.nome) ? "border-primary bg-primary/10 text-primary" : "border-border/40 bg-card/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"}`,
                  children: apt.nome
                }, apt.id))
              })]
            }, categoria))]
          })]
        })
      }), /*#__PURE__*/_jsx(TabsContent, {
        value: "equipamentos",
        children: /*#__PURE__*/_jsxs(Card, {
          className: "border-border/50 bg-card/50",
          children: [/*#__PURE__*/_jsxs(CardHeader, {
            className: "border-b border-border/40",
            children: [/*#__PURE__*/_jsxs(CardTitle, {
              className: "flex items-center gap-2 text-lg",
              children: [/*#__PURE__*/_jsx(Package, {
                className: "h-5 w-5 text-primary"
              }), "Equipamentos e Invent\xE1rio"]
            }), /*#__PURE__*/_jsx(CardDescription, {
              children: "Selecione itens do livro ou crie os seus. Todo item precisa ter um buff (efeito/benef\xEDcio)."
            })]
          }), /*#__PURE__*/_jsxs(CardContent, {
            className: "pt-6 space-y-6",
            children: [form.equipmentItems.length > 0 && /*#__PURE__*/_jsxs("div", {
              className: "p-4 border border-primary/20 rounded-lg bg-primary/5",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "text-xs font-bold uppercase tracking-wider text-primary mb-3",
                children: ["Itens Selecionados (", form.equipmentItems.length, ")"]
              }), /*#__PURE__*/_jsx("div", {
                className: "space-y-2",
                children: form.equipmentItems.map(item => /*#__PURE__*/_jsxs("div", {
                  className: "flex items-start gap-3 p-2.5 rounded-md bg-background/40 border border-border/30",
                  children: [/*#__PURE__*/_jsxs("div", {
                    className: "flex-1 min-w-0",
                    children: [/*#__PURE__*/_jsx("div", {
                      className: "text-sm font-semibold",
                      children: item.nome
                    }), /*#__PURE__*/_jsx("div", {
                      className: "text-xs text-muted-foreground",
                      children: item.buff
                    })]
                  }), /*#__PURE__*/_jsx(Button, {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => removeEquipment(item.nome),
                    className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0",
                    children: /*#__PURE__*/_jsx(X, {
                      className: "h-4 w-4"
                    })
                  })]
                }, item.nome))
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-3",
              children: [/*#__PURE__*/_jsx(Label, {
                className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Adicionar do Cat\xE1logo"
              }), /*#__PURE__*/_jsxs(Select, {
                value: form.equipmentCategory,
                onValueChange: v => set("equipmentCategory", v),
                children: [/*#__PURE__*/_jsx(SelectTrigger, {
                  className: "bg-background/60",
                  children: /*#__PURE__*/_jsx(SelectValue, {
                    placeholder: "Clique para escolher uma categoria de itens..."
                  })
                }), /*#__PURE__*/_jsx(SelectContent, {
                  children: EQUIPAMENTOS_PRESET.map(cat => /*#__PURE__*/_jsxs(SelectItem, {
                    value: cat.categoria,
                    children: [cat.categoria, " (", cat.itens.length, " itens)"]
                  }, cat.categoria))
                })]
              }), form.equipmentCategory && (() => {
                const cat = EQUIPAMENTOS_PRESET.find(c => c.categoria === form.equipmentCategory);
                if (!cat) return null;
                return /*#__PURE__*/_jsxs("div", {
                  className: "border border-border/40 rounded-lg bg-card/20 p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "text-xs font-bold uppercase tracking-wider text-primary mb-1",
                    children: cat.categoria
                  }), /*#__PURE__*/_jsx("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
                    children: cat.itens.map(item => {
                      const selected = !!form.equipmentItems.find(e => e.nome === item.nome);
                      return /*#__PURE__*/_jsxs("button", {
                        type: "button",
                        onClick: () => toggleEquipment(item),
                        className: `p-3 rounded-lg border text-left transition-all ${selected ? "border-primary bg-primary/10" : "border-border/40 bg-card/40 hover:border-primary/30"}`,
                        children: [/*#__PURE__*/_jsxs("div", {
                          className: "flex items-center justify-between gap-2 mb-1",
                          children: [/*#__PURE__*/_jsx("span", {
                            className: `text-sm font-semibold ${selected ? "text-primary" : ""}`,
                            children: item.nome
                          }), selected && /*#__PURE__*/_jsx("span", {
                            className: "text-primary text-xs shrink-0",
                            children: "\u2713"
                          })]
                        }), /*#__PURE__*/_jsx("p", {
                          className: "text-xs text-muted-foreground",
                          children: item.buff
                        })]
                      }, item.nome);
                    })
                  })]
                });
              })()]
            }), /*#__PURE__*/_jsx(Separator, {
              className: "border-border/40"
            }), /*#__PURE__*/_jsxs("div", {
              className: "p-4 border border-dashed border-border/60 rounded-lg bg-card/20 space-y-3",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2",
                children: [/*#__PURE__*/_jsx(Plus, {
                  className: "h-4 w-4 text-primary"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-sm font-bold uppercase tracking-wider text-muted-foreground",
                  children: "Outro / Item Personalizado"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2",
                children: [/*#__PURE__*/_jsx(Input, {
                  value: form.customEquipment.nome,
                  onChange: e => set("customEquipment", {
                    ...form.customEquipment,
                    nome: e.target.value
                  }),
                  className: "bg-background/60",
                  placeholder: "Nome do item..."
                }), /*#__PURE__*/_jsx(Input, {
                  value: form.customEquipment.buff,
                  onChange: e => set("customEquipment", {
                    ...form.customEquipment,
                    buff: e.target.value
                  }),
                  className: "bg-background/60",
                  placeholder: "Buff/efeito do item (obrigat\xF3rio)..."
                }), /*#__PURE__*/_jsxs(Button, {
                  type: "button",
                  onClick: addCustomEquipment,
                  className: "gap-1",
                  children: [/*#__PURE__*/_jsx(Plus, {
                    className: "h-4 w-4"
                  }), " Adicionar"]
                })]
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "Todos os itens precisam de um buff (descri\xE7\xE3o do efeito, b\xF4nus ou benef\xEDcio mec\xE2nico)."
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "p-4 border border-border/40 rounded-lg bg-card/30 space-y-3",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Resumo da Ficha"
              }), /*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-2 gap-2 text-sm",
                children: [/*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-muted-foreground",
                    children: "Nome:"
                  }), " ", /*#__PURE__*/_jsx("strong", {
                    children: form.name || "—"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-muted-foreground",
                    children: "N\xEDvel:"
                  }), " ", /*#__PURE__*/_jsx("strong", {
                    children: form.level
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-muted-foreground",
                    children: "Origem:"
                  }), " ", /*#__PURE__*/_jsx("strong", {
                    children: form.origin || "—"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-muted-foreground",
                    children: "Grau:"
                  }), " ", /*#__PURE__*/_jsx("strong", {
                    children: form.grade
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "col-span-2",
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-muted-foreground",
                    children: "Especializa\xE7\xF5es:"
                  }), " ", /*#__PURE__*/_jsx("strong", {
                    children: form.specializations.join(", ") || "—"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-muted-foreground",
                    children: "T\xE9cnica:"
                  }), " ", /*#__PURE__*/_jsx("strong", {
                    children: form.technique || "—"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-muted-foreground",
                    children: "PV/PE:"
                  }), " ", /*#__PURE__*/_jsxs("strong", {
                    children: [maxHp, "/", maxEnergy]
                  })]
                })]
              }), form.selectedAptitudes.length > 0 && /*#__PURE__*/_jsx("div", {
                className: "flex flex-wrap gap-1",
                children: form.selectedAptitudes.map(a => /*#__PURE__*/_jsx(Badge, {
                  variant: "outline",
                  className: "text-xs",
                  children: a
                }, a))
              })]
            })]
          })]
        })
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center justify-between",
      children: [/*#__PURE__*/_jsxs(Button, {
        variant: "outline",
        onClick: () => setActiveTab(tabs[currentIndex - 1]?.id),
        disabled: isFirst,
        className: "gap-2",
        children: [/*#__PURE__*/_jsx(ChevronLeft, {
          className: "h-4 w-4"
        }), "Anterior"]
      }), isLast ? /*#__PURE__*/_jsxs(Button, {
        onClick: handleSubmit,
        disabled: isPending,
        className: "gap-2",
        children: [/*#__PURE__*/_jsx(Save, {
          className: "h-4 w-4"
        }), isPending ? "Salvando..." : "Salvar Ficha"]
      }) : /*#__PURE__*/_jsxs(Button, {
        onClick: () => setActiveTab(tabs[currentIndex + 1]?.id),
        className: "gap-2",
        children: ["Pr\xF3ximo", /*#__PURE__*/_jsx(ChevronRight, {
          className: "h-4 w-4"
        })]
      })]
    })]
  });
}
