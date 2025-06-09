import type { GuildFeature, UserFlagsString } from 'discord.js';

export const white = process.env.DEV_MODE
  ? {
      addCircle: '1371021096568098857',
      minusCircle: '1371021552136491029',
      boost: '1371024758816112691',
      channel: '1371023506493411328',
      id: '1371024815934410782',
      message: '1371024863443157012',
      member: '1371024961317376000',
      pencil: '1371025048688660571',
      role: '1371025185666236496',
      role2: '1371025351559610378',
      schedule: '1371025457818112011',
      image: '1371025624264605836',
      download: '1371025673807986728',
      link: '1371025713968189451',
      reply: '1371026038922149908',
      addComponent: '1371026348776357888',
      setting: '1371026130156388352',
      home: '1371026222397526026',
      time: '1372100217553293322',
    }
  : {
      addCircle: '1371022342452547625',
      minusCircle: '1371022880074235935',
      boost: '1371026909575778414',
      channel: '1371026945646661704',
      id: '1371026989720535162',
      message: '1371027147505795173',
      member: '1371027018124230739',
      pencil: '1371027309632421969',
      role: '1371027335847084052',
      role2: '1371027360089899099',
      schedule: '1371027395615920129',
      image: '1371027467648761896',
      download: '1371027504684466306',
      link: '1371027534556430387',
      reply: '1371027590025969695',
      addComponent: '1371027626180739072',
      setting: '1371027658787520583',
      home: '1371027691708485652',
      time: '1372109876293140560',
    };

export const gray = process.env.DEV_MODE
  ? {
      member: '1371033101802934323',
      text: '1371033150599331860',
      link: '1371033190977769502',
      edit: '1371033237438201987',
      channel: '1371033319780782201',
      schedule: '1371033373929115718',
    }
  : {
      member: '1371033413368283219',
      text: '1371033440027279400',
      link: '1371033490891608146',
      edit: '1371033515516493925',
      channel: '1371033547787341905',
      schedule: '1371033574366515250',
    };

export const blurple = process.env.DEV_MODE
  ? {
      member: '1371035046424739851',
      text: '1371035177266057276',
      hammer: '1371035255867179058',
      time: '1372113598192812033',
    }
  : {
      member: '1371035329980792852',
      text: '1371035367209173052',
      hammer: '1371035400902017136',
      time: '1372113774991118356',
    };

export const red = process.env.DEV_MODE
  ? {
      flag: '1371028192428560414',
      time: '1371028258115682357',
      hammer: '1372118963143577661',
      binTrash: '1372124748171186186',
    }
  : {
      flag: '1371028135767834745',
      time: '1371028535837327510',
      hammer: '1372116893699412031',
      binTrash: '1372124956346814474',
    };

export const space = process.env.DEV_MODE
  ? '1371031893574815817'
  : '1371031995525627964';

export const success = process.env.DEV_MODE
  ? '1372813931520852029'
  : '1372814080569770014';

export const userFlag: Partial<Record<UserFlagsString, string>> = process.env
  .DEV_MODE
  ? {
      Staff: '1371039760851800074',
      Partner: '1371039984919908352',
      CertifiedModerator: '1371040015144063006',
      Hypesquad: '1371040056298569798',
      HypeSquadOnlineHouse1: '1371040088397578300',
      HypeSquadOnlineHouse2: '1371040128382013550',
      HypeSquadOnlineHouse3: '1371040153186996304',
      BugHunterLevel1: '1371040180722470932',
      BugHunterLevel2: '1371040203527032913',
      ActiveDeveloper: '1371040228093067304',
      VerifiedDeveloper: '1371040261085462578',
      PremiumEarlySupporter: '1371040283684241488',
    }
  : {
      Staff: '1371042510578651236',
      Partner: '1371042562399408128',
      CertifiedModerator: '1371042606552977439',
      Hypesquad: '1371042658822389861',
      HypeSquadOnlineHouse1: '1371042698538123396',
      HypeSquadOnlineHouse2: '1371042732381835325',
      HypeSquadOnlineHouse3: '1371042769430122626',
      BugHunterLevel1: '1371042870806446130',
      BugHunterLevel2: '1371042929480831026',
      ActiveDeveloper: '1371042963031068793',
      VerifiedDeveloper: '1371042989358448703',
      PremiumEarlySupporter: '1371043047965720576',
    };

export const guildFeatures: Partial<Record<GuildFeature, string>> = process.env
  .DEV_MODE
  ? {
      PARTNERED: '1371043946813329438',
      VERIFIED: '1371043994859208734',
      DISCOVERABLE: '1371044016337977384',
    }
  : {
      PARTNERED: '1371044114149281822',
      VERIFIED: '1371044139508043867',
      DISCOVERABLE: '1371044171065983028',
    };

const colorEmojis = { white, gray, blurple, red };
type ColorEmojis = typeof colorEmojis;
export type Emojis<
  T extends ColorEmojis[keyof ColorEmojis] = ColorEmojis[keyof ColorEmojis],
> = T extends Record<infer P, string> ? P : never;
type HasColor<
  E extends Emojis,
  C extends keyof ColorEmojis,
> = ColorEmojis[C] extends {
  [x in E]: string;
}
  ? C
  : never;
export type EmojiColors<E extends Emojis> =
  | HasColor<E, 'white'>
  | HasColor<E, 'gray'>
  | HasColor<E, 'blurple'>;

export function getColorEmoji<E extends Emojis>(
  emoji: E,
  color: EmojiColors<E>,
) {
  return colorEmojis[color][emoji as keyof (typeof colorEmojis)[typeof color]];
}
