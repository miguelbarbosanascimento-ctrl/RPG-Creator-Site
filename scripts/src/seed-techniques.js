import { db, techniquesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
const TECHNIQUES = [
// ============== TÉCNICAS INATAS ==============
{
  name: "Ilimitado (Limitless)",
  category: "Técnica Inata",
  description: "Técnica hereditária do clã Gojo que manipula o espaço em escala atômica através da convergência infinita. Permite ao usuário controlar a distância entre si e qualquer alvo, criando vácuos espaciais. Requer altíssimo controle de energia amaldiçoada.",
  source: "Inata - Clã Gojo",
  abilities: [{
    name: "Infinito (Mukagen)",
    energyCost: 2,
    description: "Passivo. Insere um espaço infinito entre o usuário e qualquer ataque, fazendo com que nada o alcance. Inimigos sofrem desvantagem em ataques físicos contra o usuário enquanto ativo."
  }, {
    name: "Lapso Azul (Aoi)",
    damage: "4d8",
    energyCost: 3,
    description: "Cria um vácuo que atrai violentamente objetos e inimigos para um ponto. Alvos em raio de 6m sofrem dano de impacto e devem passar em teste de Força (CD 15) ou serem puxados."
  }, {
    name: "Reversão Vermelha (Aka)",
    damage: "6d10",
    energyCost: 5,
    description: "Inverte a polaridade do Lapso Azul gerando uma força repulsiva devastadora em linha reta de 15m. Alvos atingidos sofrem dano contundente e são empurrados 9m."
  }, {
    name: "Estouro Imaginário Roxo (Murasaki)",
    damage: "12d12",
    energyCost: 10,
    description: "Combinação de Azul e Vermelho que cria matéria virtual. Devasta tudo em uma linha de 30m, ignora resistência a energia amaldiçoada. Uso limitado: 1x por descanso longo."
  }, {
    name: "Domínio: Vazio Roxo Infinito (Muryōkūsho)",
    damage: "8d20",
    energyCost: 15,
    description: "Expansão de Domínio. Cria um espaço onde infinita informação é forçada no cérebro do alvo, paralisando-o. Acerto garantido em todos os seres dentro do domínio (raio 20m)."
  }]
}, {
  name: "Dez Sombras (Ten Shadows)",
  category: "Técnica Inata",
  description: "Técnica hereditária do clã Zenin que permite invocar até dez shikigamis distintos usando as sombras do usuário como portal. Cada shikigami precisa ser subjugado em ritual de domação. Quando um shikigami é destruído, jamais pode ser invocado novamente — exceto através da fusão.",
  source: "Inata - Clã Zenin",
  abilities: [{
    name: "Cão Divino: Branco (Hakken)",
    damage: "2d8",
    energyCost: 1,
    description: "Invoca um cão branco rastreador. Sentido apurado revela invisibilidade e detecta maldições num raio de 30m. Ataque corpo a corpo com mordida."
  }, {
    name: "Cão Divino: Preto (Kuroken)",
    damage: "2d8",
    energyCost: 1,
    description: "Invoca o gêmeo do Branco. Combina-se com o Branco em rajada coordenada de ataques. Quando ambos são invocados juntos, somam 1d6 ao dano de cada."
  }, {
    name: "Coruja Nue",
    damage: "3d6",
    energyCost: 2,
    description: "Shikigami voador com cauda de raio. Pode transportar o usuário no ar por até 1 km. Ataque elétrico em alvo a até 18m."
  }, {
    name: "Sapo (Gama)",
    energyCost: 2,
    description: "Invoca um sapo gigante com língua extensível de 12m. Pode agarrar um alvo (teste de Força CD 14) e puxá-lo para perto do usuário."
  }, {
    name: "Lebre da Lua (Tsukimaru)",
    energyCost: 3,
    description: "Shikigami escudo com pelo branco que absorve energia amaldiçoada. Reduz dano mágico recebido em 1d10 por 3 turnos."
  }, {
    name: "Grande Serpente (Orochi)",
    damage: "6d8",
    energyCost: 4,
    description: "Serpente colossal que constringe o alvo. Dano contínuo enquanto presa não for libertada (teste de Força CD 18 para escapar)."
  }, {
    name: "Touro Demoníaco Maximizado",
    damage: "5d10",
    energyCost: 4,
    description: "Touro armado de espinhos. Carga em linha reta de 12m: cada alvo na trajetória sofre dano contundente e cai prostrado."
  }, {
    name: "Mahoraga (Versátil de Oito Manípulos)",
    damage: "10d12",
    energyCost: 12,
    description: "Shikigami supremo. Sua roda adaptativa neutraliza permanentemente qualquer técnica vista duas vezes. Convocá-lo é potencialmente fatal — exige ritual de subjugação completo. Uso restrito."
  }, {
    name: "Maldição Fusão",
    damage: "7d8",
    energyCost: 6,
    description: "Combina dois shikigamis destruídos em uma nova fera. Stats somados, recupera apenas um slot. Necessita ação completa para invocar."
  }, {
    name: "Domínio: Santuário Maligno (Chimera Shadow Garden)",
    damage: "6d10",
    energyCost: 14,
    description: "Expansão de Domínio incompleta. Manifesta todos os shikigamis simultaneamente no domínio, e o terreno se torna sombra controlável pelo usuário. Raio 25m."
  }]
}, {
  name: "Boneco de Palha (Straw Doll)",
  category: "Técnica Inata",
  description: "Técnica que usa um boneco de palha como medium. Inserindo parte do alvo (cabelo, sangue, unha) no boneco, o usuário pode causar dano à distância ressonante. Quanto mais íntimo o material, mais devastador o efeito.",
  source: "Inata - Clã Inumaki/Original",
  abilities: [{
    name: "Marca Ressonante",
    energyCost: 1,
    description: "Insere fragmento do alvo no boneco. Daí em diante, dano físico ao boneco transfere ao alvo em qualquer distância (até 1 km). Dura 24h."
  }, {
    name: "Pregos Amaldiçoados",
    damage: "3d6",
    energyCost: 2,
    description: "Crava pregos de energia no boneco marcado. Alvo sofre dano perfurante e penalidade -2 em testes físicos no próximo turno."
  }, {
    name: "Martelada Ecoante",
    damage: "5d8",
    energyCost: 3,
    description: "Esmaga o boneco com um martelo amaldiçoado. Causa dano contundente massivo e atordoa o alvo por 1 turno (teste de Constituição CD 16 para resistir)."
  }, {
    name: "Imolação Final",
    damage: "8d10",
    energyCost: 6,
    description: "Queima o boneco em chama amaldiçoada. Dano de fogo contínuo de 2d6 por 3 turnos. Destrói o vínculo após o uso."
  }, {
    name: "Domínio: Templo do Ferreiro Maldito",
    damage: "5d10",
    energyCost: 13,
    description: "Expansão de Domínio que transforma cada inimigo no domínio em um boneco de palha vivo, sofrendo passivamente os ataques do usuário ao próprio corpo. Raio 18m."
  }]
}, {
  name: "Boogie Woogie",
  category: "Técnica Inata",
  description: "Técnica de suporte simples e poderosa. Batendo palmas, o usuário troca a posição física de duas coisas que possuem energia amaldiçoada — incluindo si mesmo, aliados, inimigos ou objetos. Ideal para reposicionamento tático e quebra de defesa.",
  source: "Inata - Original",
  abilities: [{
    name: "Troca Simples",
    energyCost: 1,
    description: "Bate palmas e troca a posição de duas entidades/objetos com energia amaldiçoada à vista (até 30m). Ação rápida. Sem teste de resistência."
  }, {
    name: "Troca Encadeada",
    energyCost: 3,
    description: "Realiza até três trocas em sequência em um único turno. Útil para criar combos com aliados ou expor flancos inimigos."
  }, {
    name: "Troca de Projétil",
    damage: "Igual ao ataque trocado",
    energyCost: 2,
    description: "Troca um projétil ou ataque inimigo em pleno voo com outro alvo. O ataque original atinge o novo alvo com o mesmo dano."
  }, {
    name: "Recarga de Posição",
    energyCost: 4,
    description: "Troca a posição de um aliado abatido com a de uma cópia segura. Aliado recupera 4d8 de PV instantaneamente."
  }, {
    name: "Domínio: Sala de Jazz Infinita",
    damage: "4d8",
    energyCost: 11,
    description: "Expansão de Domínio. Cada palma do usuário no domínio causa uma troca aleatória forçada entre alvos. Cada troca aplica dano de impacto. Raio 15m."
  }]
}, {
  name: "Disparada de Sangue (Blood Manipulation)",
  category: "Técnica Inata",
  description: "Técnica hereditária do clã Kamo. Permite ao usuário controlar e moldar o próprio sangue para criar armas, projéteis, reforço físico e até efeitos defensivos. Quanto mais sangue gasto, maior o efeito — mas o usuário perde PV ao usar.",
  source: "Inata - Clã Kamo",
  abilities: [{
    name: "Flecha Convergente",
    damage: "4d8",
    energyCost: 2,
    description: "Solidifica sangue em uma flecha de alta velocidade. Alcance 24m. Custo extra: 2 PV do próprio usuário."
  }, {
    name: "Pulso Acelerado",
    energyCost: 3,
    description: "Acelera o próprio fluxo sanguíneo. +2 em testes de Destreza e iniciativa, +1d4 a todos os ataques físicos por 3 turnos. Custo: 5 PV."
  }, {
    name: "Manipulação de Distância",
    damage: "5d10",
    energyCost: 4,
    description: "Cria uma lança massiva de sangue cristalizado. Alcance 30m. Ignora 5 pontos de defesa do alvo. Custo: 8 PV."
  }, {
    name: "Coagulação Defensiva",
    energyCost: 3,
    description: "Solidifica camada de sangue ao redor do corpo. +4 na CA por 3 turnos. Custo: 4 PV."
  }, {
    name: "Estilhaço Sanguinário",
    damage: "8d6",
    energyCost: 6,
    description: "Explode uma poça de sangue criada em um raio de 6m. Cada alvo na área toma dano de fragmentação. Custo: 10 PV."
  }, {
    name: "Domínio: Câmara Vermelha do Pacto",
    damage: "6d10",
    energyCost: 14,
    description: "Expansão de Domínio. O ambiente inteiro vira sangue líquido que o usuário controla. Inimigos sofrem afogamento amaldiçoado e dano por turno. Raio 22m. Custo de PV: 20."
  }]
}, {
  name: "Transfiguração Ociosa (Idle Transfiguration)",
  category: "Técnica Inata",
  description: "Técnica monstruosa que altera o formato da alma de qualquer alvo tocado. Uma vez modificada, a alma muda permanentemente, alterando o corpo físico. Pode criar criaturas híbridas, mutações ou reforçar drasticamente um aliado.",
  source: "Inata - Original (Mahito-like)",
  abilities: [{
    name: "Toque Distorcedor",
    damage: "4d10",
    energyCost: 3,
    description: "Ataque corpo a corpo. Distorce parte do corpo do alvo, causando dano necrótico e -1 em um atributo aleatório por 5 turnos (teste de Constituição CD 16 para evitar a penalidade)."
  }, {
    name: "Corpo Plástico",
    energyCost: 2,
    description: "Reforma o próprio corpo do usuário. Resistência a dano físico (reduz 5) por 3 turnos. Pode reformar membros amputados."
  }, {
    name: "Maldição Forjada",
    damage: "5d8",
    energyCost: 5,
    description: "Converte alma humana próxima em uma maldição menor temporária que luta ao seu lado (PV 30, ataca por 4d6) por 4 turnos."
  }, {
    name: "Polimorfia Total",
    damage: "10d12",
    energyCost: 9,
    description: "Toca o alvo e dispara transfiguração explosiva. Se o alvo falhar em CD 18 de Constituição, a alma é destroçada (dano necrótico massivo + impede cura mágica por 2 turnos)."
  }, {
    name: "Domínio: Tribuna da Carne Refeita",
    damage: "8d8",
    energyCost: 14,
    description: "Expansão de Domínio. Cada alma no domínio é arrancada e remodelada. Acerto garantido com efeito de distorção total. Raio 20m. Sem custo de PV adicional."
  }]
}, {
  name: "Manipulação de Espíritos Amaldiçoados",
  category: "Técnica Inata",
  description: "Técnica de controle e absorção. Permite domar maldições derrotadas e invocá-las depois como aliados. O usuário acumula um arsenal de espíritos no decorrer da campanha, formando seu próprio bestiário pessoal.",
  source: "Inata - Original (Suguru-like)",
  abilities: [{
    name: "Absorção de Maldição",
    energyCost: 2,
    description: "Após derrotar uma maldição com vontade enfraquecida (PV ≤ 25%), engole-a numa esfera amaldiçoada. Pode armazenar até 5 maldições por nível do usuário."
  }, {
    name: "Invocação Menor",
    damage: "3d6 a 5d8",
    energyCost: 2,
    description: "Invoca uma maldição menor armazenada por 4 turnos. Stats dependem da maldição (use o bloco do monstro absorvido)."
  }, {
    name: "Invocação Maior",
    damage: "6d10 a 8d10",
    energyCost: 5,
    description: "Invoca uma maldição de grau ≥ 2. Dura 6 turnos. Usuário sofre exaustão (1 nível) após a invocação."
  }, {
    name: "Liberação Máxima: Uzumaki",
    damage: "15d12",
    energyCost: 12,
    description: "Combina todas as maldições armazenadas em uma única explosão em forma de espiral. Linha reta de 40m. Cada maldição usada acrescenta 1d12 ao dano. Esgota o arsenal."
  }, {
    name: "Domínio: Bestiário Insaciável",
    damage: "5d10 por entidade",
    energyCost: 14,
    description: "Expansão de Domínio. Todas as maldições armazenadas se manifestam simultaneamente no domínio. Acerto garantido para cada uma em todos os inimigos. Raio 20m."
  }]
}, {
  name: "Feitiçaria de Projeção (Projection Sorcery)",
  category: "Técnica Inata",
  description: "Técnica matemática que divide o tempo em quadros por segundo. Ao tocar um alvo, marca um campo de 1 segundo: se o alvo se mover mais que 24 quadros, é forçado a parar por um turno. O próprio usuário pode se mover em 24 quadros por segundo, alcançando velocidade sobre-humana.",
  source: "Inata - Original",
  abilities: [{
    name: "Aceleração Calculada",
    energyCost: 2,
    description: "Ativa modo de 24 fps. +6m de deslocamento, +2 em iniciativa e Destreza, e o usuário pode realizar 1 ação bônus extra por 3 turnos."
  }, {
    name: "Marca de Travamento",
    damage: "3d8",
    energyCost: 2,
    description: "Ataque corpo a corpo que marca o alvo. Se o alvo se mover mais que 6m no próximo turno, congela por 1 turno (sem teste de resistência)."
  }, {
    name: "Sequência Pulsante",
    damage: "6d6",
    energyCost: 4,
    description: "Realiza uma combinação de 5 ataques em sequência num mesmo turno. Cada acerto dá 1d6+modificador de Destreza."
  }, {
    name: "Filme Amaldiçoado",
    damage: "8d10",
    energyCost: 6,
    description: "Cria um intervalo de filme animado ao redor do alvo: tudo dentro do campo congela exceto o usuário. Janela de 1 turno para atacar livremente (vantagem em todos os ataques)."
  }, {
    name: "Domínio: Cinema dos 24 Quadros",
    damage: "6d12",
    energyCost: 13,
    description: "Expansão de Domínio. Qualquer inimigo dentro deve manter exatamente 24 fps de movimento — falhar (CD 18 Destreza) congela por 1 turno e sofre dano. Raio 18m."
  }]
}, {
  name: "Fala Amaldiçoada (Cursed Speech)",
  category: "Técnica Inata",
  description: "Técnica hereditária do clã Inumaki. Quaisquer palavras pronunciadas pelo usuário ganham revestimento de energia amaldiçoada, obrigando o alvo a obedecer. Quanto mais forte a ordem, maior o desgaste na garganta do usuário (PV).",
  source: "Inata - Clã Inumaki",
  abilities: [{
    name: "Pare!",
    energyCost: 1,
    description: "Alvo deve passar em teste de Sabedoria CD 14 ou ficar imóvel por 1 turno. Custo: 2 PV."
  }, {
    name: "Recue!",
    energyCost: 2,
    description: "Empurra o alvo 9m para trás. Sem teste de resistência se o alvo for grau 3 ou menor. Custo: 3 PV."
  }, {
    name: "Durma!",
    energyCost: 4,
    description: "Alvo cai no sono por 1d4 turnos (CD 18 Sabedoria para resistir). Quebra ao tomar dano. Custo: 8 PV."
  }, {
    name: "Exploda!",
    damage: "10d10",
    energyCost: 8,
    description: "Comando devastador. Alvo sofre dano amaldiçoado que ignora resistências (CD 20 Constituição para metade). Custo: 15 PV. Garganta sangra: usuário não pode falar por 2 turnos."
  }, {
    name: "Morra!",
    energyCost: 12,
    description: "Comando proibido. Alvo de grau ≤ 1 deve passar em CD 25 Constituição ou cair a 0 PV. Custo: 25 PV + 1 nível de exaustão. Uso restrito: 1x por descanso longo."
  }]
}, {
  name: "Relação de Proporção (Razão 7:3)",
  category: "Técnica Inata",
  description: "Técnica matemática que divide entidades em uma proporção exata de 7:3, criando pontos fracos artificiais. Onde a divisão acontece, o material é absurdamente frágil — mesmo paredes de metal podem ser cortadas com a unha.",
  source: "Inata - Original",
  abilities: [{
    name: "Linha de Divisão",
    damage: "5d8",
    energyCost: 2,
    description: "Marca uma linha 7:3 num objeto ou alvo. Corte físico nessa linha causa dano dobrado e ignora 10 de armadura."
  }, {
    name: "Triturador de Alvo",
    damage: "7d10",
    energyCost: 4,
    description: "Aplica a razão na anatomia do alvo. Próximo ataque corpo a corpo no alvo é crítico garantido."
  }, {
    name: "Fratura Estrutural",
    damage: "6d10",
    energyCost: 3,
    description: "Aplica a razão em uma estrutura/parede/terreno. Cria abertura permanente. Dano em qualquer um sob a estrutura caindo."
  }, {
    name: "Distribuição Triangular",
    damage: "4d8 por alvo",
    energyCost: 5,
    description: "Distribui a razão entre 3 alvos. Os três sofrem desvantagem em CA por 3 turnos."
  }, {
    name: "Domínio: Sala de Aula da Razão Áurea",
    damage: "8d10",
    energyCost: 13,
    description: "Expansão de Domínio. Cada entidade no domínio é dividida em 7:3 simultaneamente. Acerto garantido com dano massivo. Raio 18m."
  }]
}, {
  name: "Construção",
  category: "Técnica Inata",
  description: "Técnica criativa e custosa. Permite ao usuário materializar objetos físicos do zero usando energia amaldiçoada — armas, escadas, paredes, armaduras improvisadas. Quanto mais complexo, mais cara energeticamente. Pode replicar até dispositivos mecânicos simples.",
  source: "Inata - Original",
  abilities: [{
    name: "Construir Arma Simples",
    damage: "Conforme a arma criada",
    energyCost: 1,
    description: "Cria uma arma branca comum (espada, machado, lança). Dura até o fim do combate ou até quebrar."
  }, {
    name: "Construir Estrutura",
    energyCost: 3,
    description: "Materializa uma parede 3x3m (CA 18, 30 PV), uma ponte ou escada. Útil para terreno tático e cobertura."
  }, {
    name: "Construir Armadura",
    energyCost: 4,
    description: "Veste o usuário com armadura amaldiçoada. +4 CA e resistência a dano físico por 5 turnos."
  }, {
    name: "Construir Arma Avançada",
    damage: "6d10",
    energyCost: 6,
    description: "Materializa uma arma mecânica (catapulta, canhão, besta gigante). Dano à distância 30m. Munição limitada (3 tiros)."
  }, {
    name: "Construir Golem Amaldiçoado",
    damage: "5d8",
    energyCost: 8,
    description: "Cria um golem servo (PV 60, CA 15, ataca por 5d8) que obedece por 6 turnos."
  }, {
    name: "Domínio: Forja Cósmica do Artífice",
    damage: "Variável",
    energyCost: 13,
    description: "Expansão de Domínio. Dentro do domínio, qualquer arma ou construção materializa instantaneamente sem custo de energia. Acerto garantido com armas criadas. Raio 20m."
  }]
},
// ============== HABILIDADES UNIVERSAIS ==============
{
  name: "Reforço de Energia Amaldiçoada",
  category: "Técnica Especial",
  description: "Habilidade universal disponível para qualquer feiticeiro com controle básico de energia. Reveste o corpo com energia amaldiçoada para aumentar drasticamente força física, resistência e poder de ataque por curtos períodos. Base de todo combate corpo a corpo de feiticeiro.",
  source: "Universal - Técnica Básica",
  abilities: [{
    name: "Reforço Físico",
    energyCost: 1,
    description: "Bônus de +1d4 em dano físico e +2 em testes de Força por 3 turnos."
  }, {
    name: "Pele Endurecida",
    energyCost: 2,
    description: "Reduz dano físico recebido em 1d6 por 3 turnos."
  }, {
    name: "Velocidade Amaldiçoada",
    energyCost: 2,
    description: "+6m de deslocamento e +2 em iniciativa por 3 turnos."
  }, {
    name: "Soco Reforçado",
    damage: "4d8",
    energyCost: 3,
    description: "Ataque corpo a corpo único com toda a energia concentrada num único golpe. Pode quebrar barreiras menores."
  }, {
    name: "Estado Pleno",
    energyCost: 5,
    description: "Por 5 turnos: +3 em ataques físicos, +3 CA, +2d6 dano por ataque. Após o efeito, 1 nível de exaustão."
  }]
}, {
  name: "Lampejo Negro (Black Flash)",
  category: "Técnica Especial",
  description: "Acerto crítico espacial extremamente raro. Ocorre quando o feiticeiro aplica energia amaldiçoada num impacto físico dentro de uma janela menor que 0.000001 segundo. Cria uma distorção espacial visível como uma faísca preta. Multiplica o dano por 2.5 e aumenta enormemente o fluxo de energia amaldiçoada do usuário.",
  source: "Universal - Estado de Fluxo",
  abilities: [{
    name: "Tentativa de Lampejo",
    damage: "Dado base do ataque",
    energyCost: 3,
    description: "Realize um ataque com Reforço. Role 1d20: em 18+, é Lampejo Negro (dano × 2.5). Se acertar 4 Lampejos consecutivos numa mesma luta, o usuário entra no Zone (próximos 3 ataques são Lampejos garantidos)."
  }, {
    name: "Encadeamento (Combo)",
    damage: "Dano × 2.5",
    energyCost: 0,
    description: "Logo após um Lampejo Negro, o próximo ataque na mesma rodada tem chance dobrada (16+) de virar outro Lampejo."
  }, {
    name: "Lampejo Carregado",
    damage: "12d12",
    energyCost: 8,
    description: "Forças de uma única vez um Lampejo Negro em ataque carregado. Acerto garantido se em corpo a corpo. Uso restrito: 1x por combate."
  }]
}, {
  name: "Técnica Amaldiçoada Reversa (RCE)",
  category: "Técnica Especial",
  description: "Inverte a polaridade da energia negativa, multiplicando-a por si mesma para gerar energia positiva. A única forma de cura sobrenatural disponível para feiticeiros. Extremamente difícil — exige treinamento dedicado e altíssimo controle.",
  source: "Universal - Avançada",
  abilities: [{
    name: "Cura Menor",
    energyCost: 2,
    description: "Recupera 3d6 PV em si mesmo ou aliado tocado. Pode usar uma vez por turno como ação rápida."
  }, {
    name: "Restauração",
    energyCost: 4,
    description: "Recupera 6d8 PV e remove uma condição negativa (envenenado, atordoado, exaustão menor)."
  }, {
    name: "Reconstrução de Membro",
    energyCost: 8,
    description: "Regenera um membro decepado ou ferimento grave em 1 turno. Recupera 8d10 PV no aliado tocado."
  }, {
    name: "Eco Positivo",
    energyCost: 6,
    description: "Cria uma onda de cura num raio de 6m. Cada aliado recupera 4d6 PV."
  }, {
    name: "Reversão Ofensiva",
    damage: "10d10",
    energyCost: 9,
    description: "Canaliza energia positiva diretamente em um inimigo: dano massivo apenas contra maldições e mortos-vivos (ignora resistências)."
  }]
}, {
  name: "Barreiras e Cortinas",
  category: "Técnica Especial",
  description: "Arte de criação de barreiras amaldiçoadas — cúpulas invisíveis (Cortinas) que ocultam atividade amaldiçoada de civis ou domínios incompletos que aprisionam alvos. Base para o conceito de Expansão de Domínio.",
  source: "Universal - Ritual",
  abilities: [{
    name: "Cortina Simples",
    energyCost: 2,
    description: "Cria uma cúpula invisível de até 20m de raio que esconde tudo dentro de olhos comuns. Não impede passagem física. Dura 1 hora."
  }, {
    name: "Barreira de Contenção",
    energyCost: 4,
    description: "Cria uma barreira sólida em cúpula de 12m. Bloqueia entrada/saída (CA 18, 80 PV). Quem tenta atravessar leva 2d8 de dano amaldiçoado."
  }, {
    name: "Barreira Anti-Técnica",
    energyCost: 5,
    description: "Cria zona onde técnicas amaldiçoadas são suprimidas (-2 em todos os testes de técnica de quem está dentro). Raio 15m, dura 5 turnos."
  }, {
    name: "Domínio Simples (Refeição em Cadeia)",
    damage: "5d6",
    energyCost: 8,
    description: "Domínio incompleto. Atrai inimigos para o centro e aplica efeito amaldiçoado básico. Sem acerto garantido, mas com bônus de +3 nas técnicas do usuário dentro. Raio 12m."
  }]
}, {
  name: "Expansão de Domínio (Genérica)",
  category: "Técnica Especial",
  description: "A técnica suprema dos feiticeiros. Manifesta o domínio inato do usuário no mundo real através de uma barreira completa. Garante o acerto certo de todas as habilidades dentro — qualquer alvo no domínio é atingido automaticamente pelo efeito assinatura. Extremamente custosa. Cada feiticeiro tem seu próprio domínio único.",
  source: "Universal - Suprema",
  abilities: [{
    name: "Manifestação do Domínio",
    energyCost: 10,
    description: "Inicia a expansão. Por 3 turnos, cria uma cúpula amaldiçoada de 15-25m de raio. Acerto garantido para o efeito principal do domínio em todos os alvos dentro."
  }, {
    name: "Efeito Assinatura",
    damage: "8d10 a 12d12 (variável)",
    energyCost: 0,
    description: "Cada domínio tem seu efeito único definido pelo jogador (corte garantido, paralisia, queima da alma, etc). Aplicado automaticamente em todos no domínio por turno."
  }, {
    name: "Contra-Domínio: Refinamento",
    energyCost: 6,
    description: "Se outro domínio é ativado próximo, o usuário pode tentar refinar o próprio para resistir. Teste de controle de energia CD 18."
  }, {
    name: "Esgotamento Pós-Domínio",
    energyCost: 0,
    description: "Após o domínio terminar, o usuário sofre 1 nível de exaustão e -3 PE máximos pelo restante do dia. Uso restrito: 1x por descanso longo (a menos que o personagem tenha aptidão específica)."
  }]
}];
async function seed() {
  let inserted = 0;
  let skipped = 0;
  for (const tech of TECHNIQUES) {
    const existing = await db.select({
      id: techniquesTable.id
    }).from(techniquesTable).where(eq(techniquesTable.name, tech.name));
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    await db.insert(techniquesTable).values({
      name: tech.name,
      category: tech.category,
      description: tech.description,
      source: tech.source,
      abilities: JSON.stringify(tech.abilities),
      isCustom: false
    });
    inserted++;
  }
  console.log(`Seed concluído. Inseridas: ${inserted}. Já existentes (puladas): ${skipped}.`);
  process.exit(0);
}
seed().catch(err => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
