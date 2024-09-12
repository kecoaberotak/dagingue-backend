import { Application, Router } from 'express';
import { HealthRouter } from './health.route';
import { ProductRoute } from './product.route';
import { ContentRoute } from './content.route';
import { AuthRoute } from './auth.route';

const _routes: Array<[string, Router]> = [
  ['/health', HealthRouter],
  ['/product', ProductRoute],
  ['/content', ContentRoute],
  ['/auth', AuthRoute],
];

export const routes = (app: Application) => {
  _routes.forEach((route) => {
    const [url, router] = route;
    app.use(url, router);
  });
};
