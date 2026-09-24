/* eslint-disable */

// @ts-nocheck

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as LoginRouteImport } from './routes/login'
import { Route as ApiAuthSplatRouteImport } from './routes/api/auth/$'
import { Route as ApiPaymentsWebhookRouteImport } from './routes/api/payments/webhook'
import { Route as ApiMultiplayerActionRouteImport } from './routes/api/multiplayer/action'
import { Route as ApiMultiplayerMatchRouteImport } from './routes/api/multiplayer/match'
import { Route as ApiMultiplayerStateRouteImport } from './routes/api/multiplayer/state'
import { Route as ApiPaymentsBaseRouteImport } from './routes/api/payments/base'
import { Route as ShopRouteImport } from './routes/shop'

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const LoginRoute = LoginRouteImport.update({ id: '/login', path: '/login', getParentRoute: () => rootRouteImport } as any)
const ApiAuthSplatRoute = ApiAuthSplatRouteImport.update({ id: '/api/auth/$', path: '/api/auth/$', getParentRoute: () => rootRouteImport } as any)
const ApiPaymentsWebhookRoute = ApiPaymentsWebhookRouteImport.update({ id: '/api/payments/webhook', path: '/api/payments/webhook', getParentRoute: () => rootRouteImport } as any)
const ApiMultiplayerActionRoute = ApiMultiplayerActionRouteImport.update({ id: '/api/multiplayer/action', path: '/api/multiplayer/action', getParentRoute: () => rootRouteImport } as any)
const ApiMultiplayerMatchRoute = ApiMultiplayerMatchRouteImport.update({ id: '/api/multiplayer/match', path: '/api/multiplayer/match', getParentRoute: () => rootRouteImport } as any)
const ApiMultiplayerStateRoute = ApiMultiplayerStateRouteImport.update({ id: '/api/multiplayer/state', path: '/api/multiplayer/state', getParentRoute: () => rootRouteImport } as any)
const ApiPaymentsBaseRoute = ApiPaymentsBaseRouteImport.update({ id: '/api/payments/base', path: '/api/payments/base', getParentRoute: () => rootRouteImport } as any)
const ShopRoute = ShopRouteImport.update({ id: '/shop', path: '/shop', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/login': typeof LoginRoute
  '/api/auth/$': typeof ApiAuthSplatRoute
  '/api/payments/webhook': typeof ApiPaymentsWebhookRoute
  '/api/multiplayer/action': typeof ApiMultiplayerActionRoute
  '/api/multiplayer/match': typeof ApiMultiplayerMatchRoute
  '/api/multiplayer/state': typeof ApiMultiplayerStateRoute
  '/api/payments/base': typeof ApiPaymentsBaseRoute
  '/shop': typeof ShopRoute
}
export interface FileRoutesByTo extends FileRoutesByFullPath {}
export interface FileRoutesById extends FileRoutesByFullPath {
  __root__: typeof rootRouteImport
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/login' | '/api/auth/$' | '/api/payments/webhook' | '/api/multiplayer/action' | '/api/multiplayer/match' | '/api/multiplayer/state' | '/api/payments/base' | '/shop'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/login' | '/api/auth/$' | '/api/payments/webhook' | '/api/multiplayer/action' | '/api/multiplayer/match' | '/api/multiplayer/state' | '/api/payments/base' | '/shop'
  id: '__root__' | '/' | '/login' | '/api/auth/$' | '/api/payments/webhook' | '/api/multiplayer/action' | '/api/multiplayer/match' | '/api/multiplayer/state' | '/api/payments/base' | '/shop'
  fileRoutesById: FileRoutesById
}
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/login': { id: '/login'; path: '/login'; fullPath: '/login'; preLoaderRoute: typeof LoginRouteImport; parentRoute: typeof rootRouteImport }
    '/api/auth/$': { id: '/api/auth/$'; path: '/api/auth/$'; fullPath: '/api/auth/$'; preLoaderRoute: typeof ApiAuthSplatRouteImport; parentRoute: typeof rootRouteImport }
    '/api/payments/webhook': { id: '/api/payments/webhook'; path: '/api/payments/webhook'; fullPath: '/api/payments/webhook'; preLoaderRoute: typeof ApiPaymentsWebhookRouteImport; parentRoute: typeof rootRouteImport }
    '/api/multiplayer/action': { id: '/api/multiplayer/action'; path: '/api/multiplayer/action'; fullPath: '/api/multiplayer/action'; preLoaderRoute: typeof ApiMultiplayerActionRouteImport; parentRoute: typeof rootRouteImport }
    '/api/multiplayer/match': { id: '/api/multiplayer/match'; path: '/api/multiplayer/match'; fullPath: '/api/multiplayer/match'; preLoaderRoute: typeof ApiMultiplayerMatchRouteImport; parentRoute: typeof rootRouteImport }
    '/api/multiplayer/state': { id: '/api/multiplayer/state'; path: '/api/multiplayer/state'; fullPath: '/api/multiplayer/state'; preLoaderRoute: typeof ApiMultiplayerStateRouteImport; parentRoute: typeof rootRouteImport }
    '/api/payments/base': { id: '/api/payments/base'; path: '/api/payments/base'; fullPath: '/api/payments/base'; preLoaderRoute: typeof ApiPaymentsBaseRouteImport; parentRoute: typeof rootRouteImport }
    '/shop': { id: '/shop'; path: '/shop'; fullPath: '/shop'; preLoaderRoute: typeof ShopRouteImport; parentRoute: typeof rootRouteImport }
  }
}
const rootRouteChildren = {
  IndexRoute,
  LoginRoute,
  ApiAuthSplatRoute,
  ApiPaymentsWebhookRoute,
  ApiMultiplayerActionRoute,
  ApiMultiplayerMatchRoute,
  ApiMultiplayerStateRoute,
  ApiPaymentsBaseRoute,
  ShopRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
import type { getRouter } from './router.tsx'
import type { createStart } from '@tanstack/react-start'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
  }
}
