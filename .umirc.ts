import { defineConfig } from '@umijs/max';
import {routers} from './router'

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  qiankun: {
    master: {
      apps: [
        {
          name: 'pkg',
          entry: '//localhost:8001/',
        },
      ],
    },
  },
  routes: routers,
  npmClient: 'pnpm',
  mako: {}
});

