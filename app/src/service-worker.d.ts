/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Re-export the standard ServiceWorker types
export {};

// Extend the ServiceWorkerGlobalScope for our custom event handlers
declare global {
  interface WindowClient extends Client {
    focus(): Promise<WindowClient>;
  }

  interface SyncEvent extends ExtendableEvent {
    readonly tag: string;
  }

  interface PushMessageData {
    arrayBuffer(): ArrayBuffer;
    blob(): Blob;
    json<T>(): T;
    text(): string;
  }

  interface PushEvent extends ExtendableEvent {
    readonly data?: PushMessageData;
  }

  interface NotificationOptions {
    actions?: NotificationAction[];
    badge?: string;
    body?: string;
    data?: any;
    dir?: NotificationDirection;
    icon?: string;
    image?: string;
    lang?: string;
    renotify?: boolean;
    requireInteraction?: boolean;
    silent?: boolean;
    tag?: string;
    timestamp?: number;
    vibrate?: VibratePattern;
  }

  interface NotificationAction {
    action: string;
    icon?: string;
    title: string;
  }

  interface Notification {
    readonly actions: ReadonlyArray<NotificationAction>;
    readonly badge: string;
    readonly body: string;
    readonly data: any;
    readonly dir: NotificationDirection;
    readonly icon: string;
    readonly image: string;
    readonly lang: string;
    readonly renotify: boolean;
    readonly requireInteraction: boolean;
    readonly silent: boolean;
    readonly tag: string;
    readonly timestamp: number;
    readonly title: string;
    readonly vibrate: ReadonlyArray<number>;
    close(): void;
  }

  interface NotificationEvent extends ExtendableEvent {
    readonly action: string;
    readonly notification: Notification;
  }

  // Define types for BeforeInstallPromptEvent (used in PWA install)
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    prompt(): Promise<void>;
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
  }

  // Extend ServiceWorkerGlobalScope
  interface ServiceWorkerGlobalScope {
    readonly clients: Clients;
    readonly registration: ServiceWorkerRegistration;
    skipWaiting(): Promise<void>;
    
    addEventListener(type: 'sync', listener: (event: SyncEvent) => any): void;
    addEventListener(type: 'push', listener: (event: PushEvent) => any): void;
    addEventListener(type: 'notificationclick', listener: (event: NotificationEvent) => any): void;
  }

  interface ServiceWorkerRegistration {
    readonly pushManager: PushManager;
    getNotifications(options?: GetNotificationOptions): Promise<Notification[]>;
    showNotification(title: string, options?: NotificationOptions): Promise<void>;
  }

  interface Clients {
    claim(): Promise<void>;
    get(id: string): Promise<Client | undefined>;
    matchAll(options?: ClientQueryOptions): Promise<ReadonlyArray<Client>>;
    openWindow(url: string): Promise<WindowClient | null>;
  }

  interface ClientQueryOptions {
    includeUncontrolled?: boolean;
    type?: ClientTypes;
  }

  type ClientTypes = 'window' | 'worker' | 'sharedworker' | 'all';
}
