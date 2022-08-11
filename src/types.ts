import type {
  AsyncLocalStorage,
} from 'async_hooks';

export type JsonValue = JsonObject | JsonValue[] | boolean | number | string | null;

export type JsonObject = {
  [k: string]: JsonValue,
};

export type LogWriter = (message: string) => void;

export type MessageContext<T = {}> = JsonObject & T;

export type TopLevelAsyncLocalContext = {
  messageContext: MessageContext,
  transforms: ReadonlyArray<TransformMessageFunction<MessageContext>>,
};

export type NestedAsyncLocalContext = TopLevelAsyncLocalContext & {
  sequence: number,
  sequenceRoot: string,
};

export type AsyncLocalContext = NestedAsyncLocalContext | TopLevelAsyncLocalContext;

export type MessageSerializer = (message: Message<MessageContext>) => string;

export type RoarrGlobalState = {
  asyncLocalStorage?: AsyncLocalStorage<AsyncLocalContext>,
  sequence: number,
  serializeMessage?: MessageSerializer,
  versions: readonly string[],
  write: LogWriter,
};

export type SprintfArgument = boolean | number | string | null;

export type Message<T = MessageContext> = {
  readonly context: T,
  readonly message: string,
  readonly sequence: string,
  readonly time: number,
  readonly version: string,
};

export type TransformMessageFunction<T> = (message: Message<T>) => Message<MessageContext>;

export type LogMethod<Z> = {
  <T extends string = string>(
    context: Z,
    message: T,
    c?: T extends `${string}%${string}` ? SprintfArgument : never,
    d?: SprintfArgument,
    e?: SprintfArgument,
    f?: SprintfArgument,
    g?: SprintfArgument,
    h?: SprintfArgument,
    i?: SprintfArgument,
    j?: SprintfArgument
  ): void,
  <T extends string = string>(
    message: T,
    b?: T extends `${string}%${string}` ? SprintfArgument : never,
    c?: SprintfArgument,
    d?: SprintfArgument,
    e?: SprintfArgument,
    f?: SprintfArgument,
    g?: SprintfArgument,
    h?: SprintfArgument,
    i?: SprintfArgument,
    j?: SprintfArgument,
  ): void,
};

type Child<Z> = {
  <T = Z>(context: TransformMessageFunction<MessageContext<T>>): Logger<T | Z>,
  (context: MessageContext): Logger<Z>,
};

export type Logger<Z = MessageContext> = LogMethod<Z> & {
  adopt: <T>(routine: () => T, context?: MessageContext | TransformMessageFunction<MessageContext>) => Promise<T>,
  child: Child<Z>,
  debug: LogMethod<Z>,
  error: LogMethod<Z>,
  fatal: LogMethod<Z>,
  getContext: () => MessageContext,
  info: LogMethod<Z>,
  trace: LogMethod<Z>,
  warn: LogMethod<Z>,
};

export type MessageEventHandler = (message: Message<MessageContext>) => void;

// eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
export type LogLevelName = 'trace' | 'debug' | 'info' | 'error' | 'fatal' | 'warn';
