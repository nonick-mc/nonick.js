import fs from 'node:fs';
import path from 'node:path';
import { type Client, type ClientEvents, Collection } from 'discord.js';

export interface DiscordEvent<T extends keyof ClientEvents> {
  type: T;
  once?: boolean;
  execute: (...args: ClientEvents[T]) => void;
}

export class DiscordEventBuilder<T extends keyof ClientEvents>
  implements DiscordEvent<T>
{
  public readonly type: T;
  public readonly once?: DiscordEvent<T>['once'];
  public readonly execute: DiscordEvent<T>['execute'];

  constructor(data: DiscordEvent<T>);
  constructor(
    type: T,
    execute: DiscordEvent<T>['execute'],
    once?: DiscordEvent<T>['once'],
  );

  constructor(
    type: DiscordEvent<T> | T,
    execute?: DiscordEvent<T>['execute'],
    once?: DiscordEvent<T>['once'],
  ) {
    const data = typeof type === 'string' ? { type, execute, once } : type;
    if (!data.execute) throw new TypeError('execute is not specified');
    this.type = data.type;
    this.once = data.once;
    this.execute = data.execute;
  }
}

export class DiscordEvents {
  private eventManager: Collection<
    keyof ClientEvents,
    DiscordEvent<keyof ClientEvents>['execute'][]
  >;
  private onceEventManager: Collection<
    keyof ClientEvents,
    DiscordEvent<keyof ClientEvents>['execute'][]
  >;

  constructor(private readonly client: Client) {
    this.eventManager = new Collection();
    this.onceEventManager = new Collection();
  }

  async register(basePath: string, predicate?: (value: fs.Dirent) => boolean) {
    for await (const filePath of this.getAllPath(basePath, predicate)) {
      const { default: eventData } = await import(filePath);
      if (!eventData) continue;
      const events = Array.isArray(eventData) ? eventData : [eventData];
      for (const event of events) this.pushEvent(event);
    }
  }

  private getAllPath(
    basePath: string,
    predicate?: (value: fs.Dirent) => boolean,
    pre = new Set<string>(),
  ) {
    const predicateFunc =
      typeof predicate === 'function'
        ? predicate
        : (value: fs.Dirent) => !/^(-|_|\.)/.test(value.name);
    if (!fs.existsSync(basePath)) return [];
    for (const data of fs.readdirSync(basePath, { withFileTypes: true })) {
      if (data.isFile() && predicateFunc(data)) {
        pre.add(path.resolve(basePath, data.name));
        continue;
      }
      if (data.isDirectory() && predicateFunc(data))
        this.getAllPath(path.resolve(basePath, data.name), predicateFunc, pre);
    }
    return [...pre];
  }

  private pushEvent<T extends keyof ClientEvents>(event: DiscordEvent<T>) {
    const eventManager = event.once ? this.onceEventManager : this.eventManager;
    const events = (eventManager.get(event.type) ??
      []) as DiscordEvent<T>['execute'][];
    if (!events.length) {
      this.client[event.once ? 'once' : 'on'](event.type, (...args) => {
        for (const exec of events) {
          exec(...args);
        }
        if (event.once) events.splice(0, 1);
      });
    }
    events.push(event.execute);
    eventManager.set(event.type, events as []);
  }
}
