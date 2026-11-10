/**
 * The Mandarin reading collection — **original texts**, authored for VisuaLab.
 *
 * Nothing here is copied from another reading site. The editorial model was
 * inspired by Mandarin Bean (short, levelled readings with toggleable pinyin),
 * and the readings below were written for this project so they can be
 * corrected, extended and translated to pt-BR without asking anyone.
 *
 * Authoring format: `paragraphs` holds one string per paragraph, with
 * dictionary keys and punctuation separated by spaces — a word is written as
 * its key, `。` as its own token. The reader does not interpret the string —
 * `tokenizeMandarinText()` in `./mandarin-content.ts` resolves every key
 * against `./mandarin-words.ts` at module load, and
 * `./mandarin-content.spec.ts` fails the build on an unknown key.
 *
 * Keep readings short: `mandarin-content.spec.ts` rejects a paragraph over
 * `MAX_WORDS_PER_PARAGRAPH` words, so a text cannot silently grow into a wall
 * of text. The focus labels are the user-facing ones from `../language-catalog`.
 */
import type { MandarinTextSource } from './mandarin.types';

export const MANDARIN_TEXT_SOURCES: readonly MandarinTextSource[] = [
  {
    id: 'hsk1-meu-domingo',
    level: 1,
    focus: 'historias',
    title: 'Meu domingo',
    titleZh: '我的星期天',
    teaser: 'Frutas compradas, um livro lido, e a família em casa.',
    paragraphs: [
      '今天 是 星期天 。 我 很 高兴 。',
      '早上 七 点 ， 我 起床 了 。 我 的 爸爸 和 妈妈 也 起床 了 。',
      '我们 去 商店 买 水果 。 妈妈 买 了 三 个 苹果 。 我 买 了 两 个 。',
      '下午 ， 我 在 家 看 书 。 书 很 有意思 。',
      '晚上 九 点 ， 我 睡觉 。 我 爱 我 的 家 。',
    ],
    translation: [
      'Hoje é domingo. Estou muito contente.',
      'Às sete da manhã, eu me levantei. Meu pai e minha mãe também se levantaram.',
      'Fomos à loja comprar frutas. A mamãe comprou três maçãs. Eu comprei duas.',
      'À tarde, li um livro em casa. O livro é bem interessante.',
      'Às nove da noite eu durmo. Amo minha família.',
    ],
  },
  {
    id: 'hsk1-quem-e-wang-ming',
    level: 1,
    focus: 'humor',
    title: 'Quem é Wang Ming?',
    titleZh: '谁是王明？',
    teaser: 'Um nome, uma pergunta e uma resposta inesperada.',
    paragraphs: [
      '上课 了 。 老师 问 ： “ 谁 是 王明 ？ ”',
      '一 个 学生 站 起来 ， 说 ： “ 我 是 王明 。 ”',
      '老师 说 ： “ 好 ， 那 请 回答 这个 问题 ： 你 的 名字 是 什么 意思 ？ ”',
      '学生 想 了 想 ， 说 ： “ 我 不 知道 …… 可是 我 是 王明 。 ”',
      '大家 都 笑 了 。 老师 也 笑 了 ， 说 ： “ 好 ， 你 可以 坐下 了 。 ”',
    ],
    translation: [
      'A aula começou. A professora perguntou: “Quem é Wang Ming?”',
      'Um aluno se levantou e disse: “Sou eu, Wang Ming.”',
      'A professora disse: “Ótimo, então responda esta pergunta: o que significa o seu nome?”',
      'O aluno pensou um pouco e disse: “Eu não sei… mas eu sou o Wang Ming.”',
      'Todo mundo riu. A professora também riu e disse: “Está bem, pode se sentar.”',
    ],
  },
  {
    id: 'hsk2-mudanca',
    level: 2,
    focus: 'historias',
    title: 'Mudança',
    titleZh: '搬家',
    teaser: 'Uma cidade nova, nenhum amigo — e depois.',
    paragraphs: [
      '去年 ， 我 家 搬 到 了 一 个 新 城市 。',
      '新 家 不 大 ， 但是 很 干净 。',
      '刚 来 的 时候 ， 我 没有 朋友 。',
      '现在 ， 我 认识 了 很多 新 朋友 ， 他们 对 人 都 很 好 。',
      '我们 常常 一起 去 公园 ， 也 一起 吃饭 。',
    ],
    translation: [
      'No ano passado, minha família se mudou para uma cidade nova.',
      'A casa nova não é grande, mas é bem limpa.',
      'Quando cheguei, eu não tinha amigos.',
      'Agora conheci muitos amigos novos, e todos eles tratam as pessoas muito bem.',
      'Frequentemente vamos juntos ao parque e também comemos juntos.',
    ],
  },
  {
    id: 'hsk2-cha',
    level: 2,
    focus: 'cultura',
    title: 'O chá',
    titleZh: '茶',
    teaser: 'Uma bebida, um costume e um gesto de recepção.',
    paragraphs: [
      '中国 有 很多 茶 。 中国人 常常 喝 茶 。',
      '早上 ， 有的 人 喝 一 杯 茶 。 下午 ， 有的 人 和 朋友 一起 喝茶 。',
      '家 里 来 了 客人 ， 主人 会 给 客人 倒 一 杯 茶 。',
      '这 是 中国 的 习惯 。 茶 不 只是 饮料 ， 也 是 一 种 礼貌 和 热情 。',
    ],
    translation: [
      'A China tem muitos tipos de chá. Os chineses tomam chá com frequência.',
      'De manhã, algumas pessoas tomam uma xícara de chá. À tarde, algumas pessoas tomam chá com os amigos.',
      'Quando chega visita em casa, o anfitrião serve uma xícara de chá para o convidado.',
      'Este é um costume chinês. O chá não é só uma bebida: também é uma forma de cortesia e acolhimento.',
    ],
    note: 'Servir chá a quem chega é o gesto básico de recepção na China — não precisa de ocasião especial. É por isso que uma casa sempre tem chá, mesmo que ninguém beba todos os dias.',
  },
  {
    id: 'hsk3-chaves',
    level: 3,
    focus: 'humor',
    title: 'As chaves',
    titleZh: '钥匙',
    teaser: 'A pressa de sair de casa e um bolso que ninguém olhou.',
    paragraphs: [
      '早上 ， 小明 出门 的 时候 很 着急 ， 门 关上 了 ， 可是 钥匙 还 在 家 里 。',
      '他 没有 钥匙 ， 进 不 了 家 ， 只能 在 门口 等 妈妈 。',
      '他 给 妈妈 打电话 ： “ 妈妈 ， 我 进 不 了 家 ， 快 回来 ！ ”',
      '妈妈 回来 的 时候 ， 小明 把 手 伸进 口袋 ， 钥匙 就 在 口袋 里 ！',
      '妈妈 笑 了 ： “ 钥匙 一直 就 在 你 的 口袋 里 啊 ！ ” 小明 的 脸 红 了 。',
    ],
    translation: [
      'De manhã, quando o Xiaoming saiu de casa com pressa, a porta se fechou — mas a chave ficou dentro de casa.',
      'Ele não tinha a chave, não conseguia entrar em casa e só podia esperar a mãe na porta.',
      'Ele ligou para a mãe: “Mãe, não consigo entrar em casa, volta rápido!”',
      'Quando a mãe voltou, o Xiaoming pôs a mão no bolso — e a chave estava no bolso!',
      'A mãe riu: “A chave esteve no seu bolso o tempo todo!” O rosto do Xiaoming ficou vermelho.',
    ],
  },
  {
    id: 'hsk3-primeiro-jiaozi',
    level: 3,
    focus: 'historias',
    title: 'Primeira vez fazendo jiaozi',
    titleZh: '第一次包饺子',
    teaser: 'Pastéis tortos, uma lição de humildade e um cheiro bom.',
    paragraphs: [
      '第一次 去 中国 朋友 家 ， 她 教 我 做 饺子 。',
      '开始 的 时候 ， 我 包 的 饺子 又 大 又 丑 ， 大家 都 笑 了 。',
      '朋友 说 ： “ 没关系 ， 好吃 就 行 。 ”',
      '饺子 煮 好 了 ， 我们 一边 吃 一边 聊天 。',
      '那 天 的 饺子 不 好看 ， 但是 特别 香 。 我 也 学会 了 包 饺子 。',
    ],
    translation: [
      'Na primeira vez que fui à casa de uma amiga chinesa, ela me ensinou a fazer jiaozi.',
      'No começo, os jiaozi que eu moldava eram grandes e feios, e todos riram.',
      'A amiga disse: “Não tem problema; se estiver gostoso, está ótimo.”',
      'Quando os jiaozi ficaram prontos, comemos enquanto conversávamos.',
      'Os jiaozi daquele dia não eram bonitos, mas eram muito perfumados. E eu também aprendi a fazer jiaozi.',
    ],
  },
  {
    id: 'hsk4-trem-perdido',
    level: 4,
    focus: 'historias',
    title: 'O trem que perdi',
    titleZh: '错过的那班车',
    teaser: 'Meia hora de atraso e um reencontro de dez anos.',
    paragraphs: [
      '那 天 下班 以后 ， 我 着急 地 赶 去 火车站 。',
      '路上 堵车 ， 我 到 车站 的 时候 ， 火车 已经 开走 了 。',
      '我 很 难过 ， 只好 买 下一班 车 的 票 。',
      '在 等 车 的 时候 ， 我 遇见 了 一位 老 同学 。 我们 十年 没 见 了 。',
      '我们 聊 了 很久 ， 后来 成 了 很 好 的 朋友 。',
      '有时候 ， 错过 一班 车 ， 也 可能 是 遇见 一 个 人 的 开始 。',
    ],
    translation: [
      'Naquele dia, depois do trabalho, corri com pressa até a estação de trem.',
      'Houve engarrafamento na rua; quando cheguei à estação, o trem já tinha partido.',
      'Fiquei triste e não tive escolha a não ser comprar a passagem do próximo trem.',
      'Enquanto esperava, encontrei um velho colega de classe. Fazia dez anos que não nos víamos.',
      'Conversamos muito tempo e depois nos tornamos grandes amigos.',
      'Às vezes, perder um trem também pode ser o começo de um encontro.',
    ],
  },
  {
    id: 'hsk4-agua-quente',
    level: 4,
    focus: 'cultura',
    title: 'Por que água quente?',
    titleZh: '为什么喝热水',
    teaser: 'O copo de água quente no restaurante tem uma história.',
    paragraphs: [
      '到 了 中国 ， 很多 外国人 会 发现 ： 餐厅 里 常常 有 热水 ， 但是 没有 冰水 。',
      '这 是 为什么 呢 ？ 原来 ， 中国人 觉得 喝 热水 对 身体 好 ， 尤其 是 冬天 。',
      '这个 习惯 和 中医 有关 ， 也 和 从前 的 生活 条件 有关 。',
      '从前 ， 水 不 太 干净 ， 烧开 以后 再 喝 比较 安全 。',
      '慢慢 地 ， 喝 热水 就 成 了 很多 人 的 生活 习惯 。',
      '现在 ， 很多 年轻人 也 爱 喝 热水 ， 尤其 是 生病 或者 累 的 时候 。',
    ],
    translation: [
      'Ao chegar à China, muitos estrangeiros percebem: nos restaurantes costuma haver água quente, mas não água com gelo.',
      'Por que será? Acontece que os chineses acham que beber água quente faz bem à saúde, especialmente no inverno.',
      'Esse costume tem a ver com a medicina tradicional chinesa e também com as condições de vida de antigamente.',
      'Antigamente a água não era muito limpa; fervê-la antes de beber era mais seguro.',
      'Aos poucos, beber água quente virou hábito de muita gente.',
      'Hoje, muitos jovens também gostam de água quente, especialmente quando estão doentes ou cansados.',
    ],
    note: 'A água quente na mesa não é exotismo: é história de saúde pública (ferver era o jeito de tornar a água segura), de medicina tradicional (o corpo “frio” pede bebida quente) e de hábito doméstico ao mesmo tempo.',
  },
  {
    id: 'hsk5-duas-noticias',
    level: 5,
    focus: 'humor',
    title: 'Uma boa e uma má notícia',
    titleZh: '好消息和坏消息',
    teaser: 'Sexta-feira, fim de expediente, e um plano que ainda não começou.',
    paragraphs: [
      '星期五 下午 ， 办公室 里 的 人 都 在 等 下班 。',
      '老板 突然 说 ： “ 大家 辛苦 一下 ， 这个 方案 下个 星期一 要 交 。 ”',
      '没 人 说话 。 只有 小李 站 起来 说 ： “ 老板 ， 我 有 一 个 好消息 和 一 个 坏消息 。 ”',
      '老板 问 ： “ 先 说 好消息 。 ”',
      '小李 说 ： “ 我们 下个 星期一 一定 能 交 。 ” 大家 都 放心 了 。',
      '老板 又 问 ： “ 那 坏消息 呢 ？ ” 小李 说 ： “ 这个 方案 ， 我们 还 没 开始 做 。 ”',
      '老板 愣 了 一下 ， 也 笑 了 ： “ 那 我 说 一 个 好消息 ： 你们 今天 就 开始 吧 。 ”',
    ],
    translation: [
      'Na tarde de sexta-feira, todo mundo no escritório esperava o fim do expediente.',
      'De repente o chefe disse: “Pessoal, um esforço: este plano tem de ser entregue na próxima segunda-feira.”',
      'Ninguém falou nada. Só o Xiao Li se levantou e disse: “Chefe, tenho uma boa e uma má notícia.”',
      'O chefe perguntou: “Fale primeiro a boa notícia.”',
      'O Xiao Li disse: “Na próxima segunda-feira com certeza conseguimos entregar.” Todos ficaram tranquilos.',
      'O chefe perguntou de novo: “E a má notícia?” O Xiao Li disse: “Este plano, nós ainda não começamos a fazer.”',
      'O chefe ficou parado por um instante e também riu: “Então eu digo uma boa notícia: vocês começam hoje mesmo.”',
    ],
  },
  {
    id: 'hsk5-vermelho-do-ano-novo',
    level: 5,
    focus: 'cultura',
    title: 'O vermelho do Ano Novo',
    titleZh: '春节的红色',
    teaser: 'Por que tudo fica vermelho quando o ano vira.',
    paragraphs: [
      '春节 是 中国 最 重要 的 节日 ， 也 是 最 热闹 的 节日 。',
      '节前 ， 人们 会 把 家 打扫 干净 ， 还 会 买 很多 红色 的 小 东西 ： 红色 的 对联 、 红色 的 灯笼 、 红色 的 衣服 。',
      '在 春节 ， 红色 不 只是 好看 。 中国人 认为 红色 代表 好运 和 高兴 。',
      '除夕 晚上 ， 一家人 一起 吃 年夜饭 。 很多 人 不管 离家 多远 ， 都 会 回家 。',
      '第二天 ， 孩子 们 会 给 长辈 拜年 ， 长辈 会 给 孩子 红包 。',
      '春节 的 红色 ， 其实 是 一句 简单 的 祝福 ： 希望 新 的 一年 ， 大家 平安 、 顺利 。',
    ],
    translation: [
      'A Festa da Primavera é o festival mais importante da China e também o mais animado.',
      'Antes do festival, as pessoas limpam a casa e compram muitas coisinhas vermelhas: dísticos vermelhos, lanternas vermelhas e roupas vermelhas.',
      'No Ano Novo, o vermelho não é só bonito. Os chineses consideram que o vermelho representa boa sorte e alegria.',
      'Na véspera, a família janta junta a ceia de Ano Novo. Muitas pessoas, não importa o quão longe estejam de casa, voltam para casa.',
      'No dia seguinte, as crianças visitam os mais velhos para os cumprimentos de Ano Novo, e os mais velhos dão envelopes vermelhos às crianças.',
      'O vermelho do Ano Novo é, na verdade, um voto simples: que no novo ano todos estejam em segurança e que tudo corra bem.',
    ],
    note: 'Na tradição chinesa o vermelho não é cor de alerta nem de paixão: é cor de proteção e de vida nova. Por isso aparece nos dísticos, nas lanternas e nos envelopes com dinheiro que as crianças recebem.',
  },
];
